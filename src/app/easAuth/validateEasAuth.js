'use strict';

const invitations = require('./../../infrastructure/Invitations');

const action = async (req, res) => {
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
    return res.redirect(`/eas-token/${req.params.id}`);
  }
};

module.exports = action;