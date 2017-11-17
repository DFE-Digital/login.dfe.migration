'use strict';
const listEndpoints = require('express-list-endpoints')

const devRoutes = require('./../devLauncher');
const migrationHome = require('./../home');
const legacyAuth = require('./../legacyAuth');
const userDetails = require('./../userDetails');
const config = require('./../../infrastructure/config');

const routes = (app, csrf) => {
  app.use('/osa-auth', legacyAuth(csrf));
  app.use('/my-details', userDetails());
  app.use('/', migrationHome(csrf));
  if(config.hostingEnvironment.showDevViews === 'true') app.use('/dev',devRoutes(csrf, listEndpoints(app)));
};

module.exports = routes;