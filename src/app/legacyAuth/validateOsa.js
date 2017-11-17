'use strict';

const invitations = require('./../../infrastructure/Invitations/DirectoriesApiInvitations');

const validateOsa = async (req, res) => {

  const invitationResult = await invitations.validateOsaCredentials(req.body.id, req.body.username, req.body.password);

  if(invitationResult === true) {
    req.session.invitation = {
      id: '8226a3d1-823a-4e52-83b3-6e6a117cef0f',
      firstName: 'Wade',
      lastName: 'Wilson',
      email: 'wwilson@x-force.test'
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