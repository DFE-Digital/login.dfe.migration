'use strict';

const invitations = require('./../../infrastructure/Invitations/DirectoriesApiInvitations');

const validateOsa = async (req, res) => {

  const invitationResult = await invitations.validateOsaCredentials(req.body.id, req.body.username, req.body.password);


  res.render('legacyAuth/views/legacyAuth', {
    title: 'Sign in to Secure Access',
    csrfToken: req.csrfToken(),
    id: req.params.id
  });
};

module.exports = validateOsa;