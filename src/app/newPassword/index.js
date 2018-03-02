'use strict';

const express = require('express');
const { isLoggedIn } = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });
const getNewPassword = require('./getNewPassword');
const postNewPassword = require('./postNewPassword');


const newPasswordRoutes = (csrf) => {
  logger.info('Mounting new password routes');

  router.get('/', isLoggedIn, csrf, asyncWrapper(getNewPassword));
  router.post('/', isLoggedIn, csrf, asyncWrapper(postNewPassword));

  return router;
};

module.exports = newPasswordRoutes;
