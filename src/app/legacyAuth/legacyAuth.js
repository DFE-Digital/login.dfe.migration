'use strict';

const legacyAuth = async (req, res) => {
  res.render('legacyAuth/views/legacyAuth', {
    title: 'Sign in to Secure Access',
    csrfToken: req.csrfToken(),
    id: req.params.id,
    validationFailed: false,
    validationMessages: {
      username: '',
      password: '',
    },
  });
};

module.exports = legacyAuth;
