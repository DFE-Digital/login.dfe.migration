'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { isLoggedIn } = require('../../infrastructure/utils');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const captureToken = require('./captureToken');
const validateToken = require('./validateToken');

const router = express.Router({ mergeParams: true });

const easToken = (csrf) => {
  logger.info('Mounting eas token routes');

  router.get('/:id', csrf, isLoggedIn, asyncWrapper(captureToken));
  router.post('/:id', csrf, isLoggedIn, asyncWrapper(validateToken));

  return router;
};

module.exports = easToken;
