'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');

const captureToken = require('./captureToken');
const validateToken = require('./validateToken');

const router = express.Router({ mergeParams: true });

const easToken = (csrf) => {
  logger.info('Mounting eas token routes');

  router.get('/:id', csrf, captureToken);
  router.post('/:id', csrf, validateToken);

  return router;
};

module.exports = easToken;
