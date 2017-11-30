'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');

const showOsaAuth = require('./showOsaAuth');

const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting eas auth routes');

  router.get('/:id', csrf, showOsaAuth);

  return router;
};

module.exports = home;
