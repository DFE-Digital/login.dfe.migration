'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const get = require('./home');

const router = express.Router({ mergeParams: true });

const home = () => {
  logger.info('Mounting home routes');

  router.get('/:id', get);
  return router;
};

module.exports = home;
