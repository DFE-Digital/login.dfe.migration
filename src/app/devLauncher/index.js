'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const {isLoggedIn} = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');


const router = express.Router({ mergeParams: true });

const devLauncher = (csrf, routes) => {
  logger.info('Mounting dev routes');

  router.get('/', isLoggedIn, (req, res) => {
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
