'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const legacyAuth = require('./legacyAuth');
const post = require('./validateOsa');

const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting osa auth routes');

  router.get('/:id', csrf, asyncWrapper(legacyAuth));
  router.post('/:id', csrf, asyncWrapper(post));

  return router;
};

module.exports = home;
