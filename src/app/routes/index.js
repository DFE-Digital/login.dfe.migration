'use strict';
const listEndpoints = require('express-list-endpoints')

const devRoutes = require('./../devLauncher');
const migrationHome = require('./../home');
const legacyAuth = require('./../legacyAuth');
const userDetails = require('./../userDetails');
const config = require('./../../infrastructure/config');

const routes = (app, csrf) => {
  app.use('/', migrationHome(csrf));
  app.use('/osa-auth', legacyAuth(csrf));
  app.use('/my-details', userDetails());
  if(config.hostingEnvironment.showDevViews === 'true') app.use('/dev',devRoutes(csrf, listEndpoints(app)));
};

module.exports = routes;