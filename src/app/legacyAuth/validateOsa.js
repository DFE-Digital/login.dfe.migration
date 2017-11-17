'use strict';

const invitations = require('./../../infrastructure/Invitations/DirectoriesApiInvitations');

const legacyAuth = async (req, res) => {

  const invitation = await invitations.getById(req.params.id);


  res.render('legacyAuth/views/legacyAuth', {
    title: 'Sign in to Secure Access',
    csrfToken: req.csrfToken(),
    id: req.params.id
  });
};

module.exports = legacyAuth;