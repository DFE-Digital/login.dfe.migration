'use strict';

const express = require('express');
const {isLoggedIn} = require('../../infrastructure/utils');
const logger = require('../../infrastructure/logger');
const router = express.Router({ mergeParams: true });

const getDetails = require('./getDetails');

const userDetails = () => {
  logger.info('Mounting user details routes');

  router.get('/', isLoggedIn, getDetails);

  return router;
};

module.exports = userDetails;
