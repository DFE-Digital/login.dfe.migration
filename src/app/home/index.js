'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const getIndex = require('./home');
const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting home routes');

  router.get('/', getIndex);

  return router;
};

module.exports = home;
