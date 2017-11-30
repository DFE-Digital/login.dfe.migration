'use strict';

const handler = async (req, res) => {
  res.render('newPassword/views/newPassword', {
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
    csrfToken: req.csrfToken(),
  });
};

module.exports = handler;

