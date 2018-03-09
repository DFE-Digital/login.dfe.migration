'use strict';

const config = require('./../../infrastructure/config');

const handler = async (req, res) => {
  let destinationUrl = config.hostingEnvironment.portalUrl;
  let destinationDescription = 'See your services';
  let message = '';

  // if there is a token then is an EAS user
  if (req.session.completedInvitation.tokenSerialNumber) {
    destinationUrl = config.hostingEnvironment.ktsUrl;
    destinationDescription = 'Go to Key to Success';
    message = 'Your KTS permissions have been ported over from the \'Government Gateway sign-in\' to \'DfE sign in\'. If you access other secure DfE services these will be moved over to DfE sign in soon';
  }

  let view = 'complete';
  if (req.session.completedInvitation.source === 'support') {
    view = 'completeSupport';
  }

  res.render(`complete/views/${view}`, {
    id: req.user.id,
    email: req.user.email,
    destinationUrl,
    destinationDescription,
    message,
  });
};

module.exports = handler;
