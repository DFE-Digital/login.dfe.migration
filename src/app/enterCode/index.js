'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const showEasAuth = require('./showCodeEntry');
const validateEasAuth = require('./validateCode');

const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting eas auth routes');

  router.get('/:id', csrf, asyncWrapper(showEasAuth));
  router.post('/:id', csrf, asyncWrapper(validateEasAuth));

  return router;
};

module.exports = home;
