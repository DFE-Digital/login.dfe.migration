'use strict';

const invitations = require('./../../infrastructure/Invitations');

const validateCode = (invitation, code) => {
  if (!code || !invitation.code) {
    return false;
  }

  return invitation.code.toUpperCase() === code.toUpperCase();
};

const action = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
  }

  const validationResult = validateCode(invitation, req.body.password);
  if (!validationResult) {
    return res.render('easAuth/views/easAuth', {
      title: 'Sign in to using EAS details',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      validationFailed: true,
      validationMessages: {
        password: 'Invalid verification code'
      },
    });
  } else {
    req.session.invitation = {
      id: invitation.id,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
      tokenSerialNumber: invitation.oldCredentials.tokenSerialNumber,
      source: invitation.oldCredentials.source,
    };
    return res.redirect(`/eas-token/${req.params.id}`);
  }
};

module.exports = action;