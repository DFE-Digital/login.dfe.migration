'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../../infrastructure/logger');
const listEndpoints = require('express-list-endpoints');

const router = express.Router({ mergeParams: true });

const devLauncher = () => {
  logger.info('Mounting dev routes');

  router.get('/', (req, res) => {
    const routes = listEndpoints(req.app);
    res.render('devLauncher/views/launchpad', {
      title: 'Dev launcher',
      uuid: uuid(),
      user: req.user,
      routes,
    });
  });

  return router;
};

module.exports = devLauncher;
