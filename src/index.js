const config = require('./infrastructure/config');
const logger = require('./infrastructure/logger');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const http = require('http');
const https = require('https');
const fs = require('fs');
const csurf = require('csurf');
const path = require('path');
const flash = require('express-flash-2');
const helmet = require('helmet');
const sanitization = require('login.dfe.sanitization');
const { getErrorHandler, ejsErrorPages } = require('login.dfe.express-error-handling');
const setupAppRoutes = require('./app/routes');
const setCorrelationId = require('express-mw-correlation-id');
const KeepAliveAgent = require('agentkeepalive');

http.GlobalAgent = new KeepAliveAgent({
  maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
  maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
  timeout: config.hostingEnvironment.agentKeepAlive.timeout,
  keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
});
https.GlobalAgent = new KeepAliveAgent({
  maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
  maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
  timeout: config.hostingEnvironment.agentKeepAlive.timeout,
  keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
});

const app = express();
app.use(setCorrelationId(true));
app.use(helmet({
  noCache: true,
  frameguard: {
    action: 'deny',
  },
}));

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}

const csrf = csurf({
  cookie: {
    secure: true,
    httpOnly: true,
  },
});

const { migrationSchema, validateConfig } = require('login.dfe.config.schema');

validateConfig(migrationSchema, config, logger, config.hostingEnvironment.env !== 'dev');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sanitization());
app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'app'));
app.use(expressLayouts);

app.set('layout', 'layouts/layout');

let expiryInMinutes = 30;
const sessionExpiry = parseInt(config.hostingEnvironment.sessionCookieExpiryInMinutes);
if (!isNaN(sessionExpiry)) {
  expiryInMinutes = sessionExpiry;
}
app.use(session({
  keys: [config.hostingEnvironment.sessionSecret],
  maxAge: expiryInMinutes * 60000, // Expiry in milliseconds
  httpOnly: true,
  secure: true,
}));
app.use((req, res, next) => {
  req.session.now = Date.now();
  next();
});


app.use(cookieParser());
app.use(flash());


// Setup global locals for layouts and views
Object.assign(app.locals, {
    urls: {
        interactions: config.hostingEnvironment.interactionsUrl,
        help: config.hostingEnvironment.helpUrl,
    },
    gaTrackingId: config.hostingEnvironment.gaTrackingId,
});

setupAppRoutes(app, csrf);

const errorPageRenderer = ejsErrorPages.getErrorPageRenderer({
  help: config.hostingEnvironment.helpUrl,
}, config.hostingEnvironment.env === 'dev');
app.use(getErrorHandler({
  logger,
  errorPageRenderer,
}));

if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  app.get('/quick-login', (req, res) => {
    req.session.invitation = {

      id: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',

      firstName: 'Wade',
      lastName: 'Wilson',
      email: 'wwilson@x-force.test',
    };
    res.redirect('/my-details');
  });

  const options = {
    key: config.hostingEnvironment.sslKey,
    cert: config.hostingEnvironment.sslCert,
    requestCert: false,
    rejectUnauthorized: false,
  };
  const server = https.createServer(options, app);

  server.listen(config.hostingEnvironment.port, () => {
    logger.info(`Dev server listening on https://${config.hostingEnvironment.host}:${config.hostingEnvironment.port} with config:\n${JSON.stringify(config)}`);
  });
} else {
  app.listen(process.env.PORT, () => {
    logger.info(`Server listening on http://${config.hostingEnvironment.host}:${process.env.PORT}`);
  });
}
