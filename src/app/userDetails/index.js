'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });

const getDetails = require('./getDetails');

const userDetails = () => {
  logger.info('Mounting user details routes');

  router.get('/', isLoggedIn, asyncWrapper(getDetails));

  return router;
};

module.exports = userDetails;
