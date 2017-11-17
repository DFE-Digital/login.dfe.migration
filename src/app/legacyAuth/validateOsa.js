'use strict';

const invitations = require('./../../infrastructure/Invitations/DirectoriesApiInvitations');

const validateOsa = async (req, res) => {

  const invitationResult = await invitations.validateOsaCredentials(req.body.id, req.body.username, req.body.password);

  if(invitationResult) {
    req.session.invitation = {
      id: invitationResult.id,
      firstName: invitationResult.firstName,
      lastName: invitationResult.lastName,
      email: invitationResult.email
    };
    //todo go to details page

  }else{
    res.render('legacyAuth/views/legacyAuth', {
      title: 'Sign in to Secure Access',
      csrfToken: req.csrfToken(),
      id: req.params.id
    });
  }


};

module.exports = validateOsa;