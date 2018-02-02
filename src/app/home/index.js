'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const get = require('./home');
const emailInUse = require('./emailInUse');

const router = express.Router({ mergeParams: true });

const home = () => {
  logger.info('Mounting home routes');

  router.get('/:id', get);
  router.get('/:id/email-in-use', emailInUse);
  return router;
};

module.exports = home;
