'use strict';

const express = require('express');
const {isLoggedIn} = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const router = express.Router({mergeParams: true});
const getNewPassword = require('./getNewPassword');
const postNewPassword = require('./postNewPassword');


const newPasswordRoutes = (csrf) => {
  logger.info('Mounting new password routes');

  router.get('/', isLoggedIn, csrf, getNewPassword);
  router.post('/', isLoggedIn, csrf, postNewPassword);

  return router;
};

module.exports = newPasswordRoutes;