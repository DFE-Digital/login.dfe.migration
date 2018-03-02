'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const get = require('./home');
const emailInUse = require('./emailInUse');
const migrationComplete = require('./migrationComplete');

const router = express.Router({ mergeParams: true });

const home = () => {
  logger.info('Mounting home routes');

  router.get('/:id', get);
  router.get('/:id/email-in-use', asyncWrapper(emailInUse));
  router.get('/:id/migration-complete', asyncWrapper(migrationComplete));
  return router;
};

module.exports = home;
