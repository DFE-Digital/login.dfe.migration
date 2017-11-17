'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const get = require('./home');
const post = require('./validateOsa');
const router = express.Router({ mergeParams: true });

const home = (csrf) => {
  logger.info('Mounting home routes');

  router.get('/:id', get);
  router.post('/', csrf, post);
  return router;
};

module.exports = home;
