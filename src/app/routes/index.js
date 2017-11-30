'use strict';


const devRoutes = require('./../devLauncher');
const migrationHome = require('./../home');
const legacyAuth = require('./../legacyAuth');
const userDetails = require('./../userDetails');
const newPassword = require('./../newPassword');
const complete = require('./../complete');
const config = require('./../../infrastructure/config');

const routes = (app, csrf) => {
  if (config.hostingEnvironment.showDevViews === 'true') app.use('/dev', devRoutes(csrf));
  app.use('/osa-auth', legacyAuth(csrf));
  app.use('/my-details', userDetails());
  app.use('/new-password', newPassword(csrf));
  app.use('/complete', complete());
  app.use('/', migrationHome(csrf));
};

module.exports = routes;
