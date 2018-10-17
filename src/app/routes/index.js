'use strict';


const devRoutes = require('./../devLauncher');
// const migrationHome = require('./../home');
// const osaAuth = require('../osaAuth');
// const easAuth = require('../easAuth');
// const enterCode = require('../enterCode');
// const easToken = require('../easToken');
// const userDetails = require('./../userDetails');
// const newPassword = require('./../newPassword');
// const complete = require('./../complete');
const config = require('./../../infrastructure/config');
const healthCheck = require('login.dfe.healthcheck');

const routes = (app, csrf) => {
  app.use('/healthcheck', healthCheck({ config }));
  if (config.hostingEnvironment.useDevViews === true) {
    app.use('/dev', devRoutes(csrf));
  }
  // app.use('/osa-auth', osaAuth(csrf));
  // app.use('/eas-auth', easAuth(csrf));
  // app.use('/enter-code', enterCode(csrf));
  // app.use('/eas-token', easToken(csrf));
  // app.use('/my-details', userDetails());
  // app.use('/new-password', newPassword(csrf));
  // app.use('/complete', complete());
  // app.use('/', migrationHome(csrf));

  app.get('/:id', (req, res) => {
    res.redirect(`${config.hostingEnvironment.profileUrl}/register/${req.params.id}`);
  });
};

module.exports = routes;
