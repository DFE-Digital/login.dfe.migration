'use strict';

const express = require('express');
const logger = require('../../infrastructure/logger');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const router = express.Router({ mergeParams: true });

const getComplete = require('./getComplete');

const doesHaveUser = (req, res, next) => {
  if (req.session.user && req.session.user.email) {
    req.user = req.session.user;
    return next();
  }
  return res.status(302).redirect('/');
};


const routes = () => {
  logger.info('Mounting completed routes');

  router.get('/', doesHaveUser, asyncWrapper(getComplete));

  return router;
};

module.exports = routes;
