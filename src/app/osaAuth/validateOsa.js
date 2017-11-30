'use strict';

const invitations = require('./../../infrastructure/Invitations/DirectoriesApiInvitations');

const validate = (username, password) => {
  const messages = {
    username: '',
    password: '',
  };
  let failed = false;

  if (!username) {
    messages.username = 'Enter your username';
    failed = true;
  }

  if (!password) {
    messages.password = 'Enter your password';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const validateOsa = async (req, res) => {
  const formValidationResult = validate(req.body.username, req.body.password);

  if (formValidationResult.failed) {
    res.render('osaAuth/views/osaAuth', {
      title: 'Sign in to Secure Access',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      username: req.body.username,
      validationFailed: true,
      validationMessages: formValidationResult.messages,
    });
    return;
  }

  const invitationResult = await invitations.validateOsaCredentials(req.body.id, req.body.username, req.body.password);

  if (invitationResult) {
    req.session.invitation = {
      id: invitationResult.id,
      firstName: invitationResult.firstName,
      lastName: invitationResult.lastName,
      email: invitationResult.email,
    };
    res.redirect('../my-details');
  } else {
    res.render('osaAuth/views/osaAuth', {
      title: 'Sign in to Secure Access',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      username: req.body.username,
      validationFailed: true,
      validationMessages: {
        username: '',
        password: '',
      },
    });
  }
};

module.exports = validateOsa;
