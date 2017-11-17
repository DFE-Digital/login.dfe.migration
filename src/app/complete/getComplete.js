'use strict';
const config = require('./../../infrastructure/config');

const handler = async (req, res) => {


  res.render('complete/views/complete', {
    id: req.user.id,
    email: req.user.email,
    portalUrl: config.hostingEnvironment.portalUrl,
  });

};

module.exports = handler;
