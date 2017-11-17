const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const logger = require('./infrastructure/logger');
const https = require('https');
const fs = require('fs');
const path = require('path');
const setupAppRoutes = require('./app/routes');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const csrf = csurf({ cookie: true });
const app = express();
const config = require('./infrastructure/config');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: fs.createWriteStream('./access.log', { flags: 'a' }) }));
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'app'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.hostingEnvironment.sessionSecret
}));

setupAppRoutes(app, csrf);

if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  app.get('/quick-login', (req, res) => {
    req.session.invitation = {
      id: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
      firstName: 'Wade',
      lastName: 'Wilson',
      email: 'wwilson@x-force.test'
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