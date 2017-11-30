'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');

const showEasAuth = require('./showEasAuth');
const validateEasAuth = require('./validateEasAuth');

const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting eas auth routes');

  router.get('/:id', csrf, showEasAuth);
  router.post('/:id', csrf, validateEasAuth);

  return router;
};

module.exports = home;
