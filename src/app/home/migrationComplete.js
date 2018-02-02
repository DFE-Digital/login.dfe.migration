'use strict';

const config = require('./../../infrastructure/config');
const invitations = require('./../../infrastructure/Invitations');

const migrationComplete = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  const destinationUrl = invitation.oldCredentials.source === 'EAS' ? config.hostingEnvironment.ktsUrl: config.hostingEnvironment.portalUrl;
  return res.render('home/views/migrationComplete', {
    destinationUrl,
  });
};

module.exports = migrationComplete;
