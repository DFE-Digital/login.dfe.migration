const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const logger = require('./infrastructure/logger');
const https = require('https');
const fs = require('fs');
const csurf = require('csurf');
const path = require('path');
const flash = require('express-flash-2');
const app = express();
const config = require('./infrastructure/config');
const csrf = csurf({ cookie: true });

const homeScreen = require('./app/home');
const userDetails = require('./app/userDetails');
const newPassword = require('./app/newPassword');
const complete = require('./app/complete');

app.use(bodyParser.urlencoded({ extended: true }));
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


app.use(cookieParser());
app.use(flash());
app.use('/', homeScreen());
app.use('/my-details', userDetails());
app.use('/new-password', newPassword(csrf));
app.use('/complete', complete());
if (config.hostingEnvironment.env === 'dev') {
  app.proxy = true;

  app.get('/quick-login', (req, res) => {
    req.session.invitation = {
      id: '11e891fa-c176-4078-8a98-788d50912e55',
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