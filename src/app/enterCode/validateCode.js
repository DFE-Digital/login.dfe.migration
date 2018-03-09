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

  const validationResult = validateCode(invitation, req.body.code);
  if (!validationResult) {
    return res.render('enterCode/views/enterCode', {
      title: 'Enter your verification code\n',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      validationFailed: true,
      validationMessages: {
        password: 'Invalid verification code',
      },
    });
  }

  req.session.invitation = {
    id: invitation.id,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
    tokenSerialNumber: invitation.tokenSerialNumber,
    tokenSyncd: true,
    source: invitation.source,
  };
  return res.redirect('../my-details');
};

module.exports = action;
