'use strict';

const config = require('./../../infrastructure/config');

const handler = async (req, res) => {
  let destinationUrl = config.hostingEnvironment.portalUrl;
  let destinationDescription = 'See your services';
  let message = '';

  // if there is a token then is an EAS user
  if (req.session.completedInvitation.tokenSerialNumber) {
    destinationUrl = config.hostingEnvironment.ktsUrl;
    destinationDescription = 'Continue';
    message = 'You can now use your email, new password and synced token to access Key to Success.';
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
