'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const legacyAuth = require('./legacyAuth');
const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting legacy auth routes');

  router.get('/:id',csrf, legacyAuth);

  return router;
};

module.exports = home;
