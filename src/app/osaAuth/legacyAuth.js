'use strict';

const legacyAuth = async (req, res) => {
  res.render('osaAuth/views/osaAuth', {
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
