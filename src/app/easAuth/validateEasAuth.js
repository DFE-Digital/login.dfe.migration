'use strict';

const invitations = require('./../../infrastructure/Invitations');

const action = async (req, res) => {
  const invitation = await invitations.getById(req.params.id);
  if (!invitation) {
    return res.status(404).send();
  }

  const validationResult = await invitations.validateOsaCredentials(req.params.id, req.body.username, req.body.password);
  if (!validationResult) {
    return res.render('easAuth/views/easAuth', {
      title: 'Sign in to using EAS details',
      csrfToken: req.csrfToken(),
      id: req.params.id,
      validationFailed: true,
      validationMessages: {
        username: '',
        password: '',
      },
    });
  } else {
    req.session.invitation = {
      id: invitation.id,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      email: invitation.email,
    };
    return res.redirect(`/eas-token/${req.params.id}`);
  }
};

module.exports = action;