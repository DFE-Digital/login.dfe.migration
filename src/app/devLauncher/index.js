'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const listEndpoints = require('express-list-endpoints');

const router = express.Router({ mergeParams: true });

const devLauncher = () => {
  logger.info('Mounting dev routes');

  router.get('/', asyncWrapper((req, res) => {
    const routes = listEndpoints(req.app);
    res.render('devLauncher/views/launchpad', {
      title: 'Dev launcher',
      uuid: uuid(),
      user: req.user,
      routes,
    });
  }));

  return router;
};

module.exports = devLauncher;
