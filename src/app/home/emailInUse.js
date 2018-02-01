'use strict';

const config = require('./../../infrastructure/config');
const invitations = require('./../../infrastructure/Invitations');

const emailInUse = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  const destinationUrl = invitation.oldCredentials.source === 'EAS' ? config.hostingEnvironment.ktsUrl: config.hostingEnvironment.portalUrl;
  return res.render('home/views/emailInUse', {
    destinationUrl,
  });
};

module.exports = emailInUse;
