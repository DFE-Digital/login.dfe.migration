'use strict';

const handler = async (req, res) => {
  res.render('newPassword/views/newPassword', {
    title: 'Create a new password for your DfE Sign-in account',
    newPassword: '',
    confirmPassword: '',
    validationFailed: false,
    validationMessages: {},
    csrfToken: req.csrfToken(),
  });
};

module.exports = handler;

