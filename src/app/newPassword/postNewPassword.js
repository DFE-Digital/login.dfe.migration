'use strict';
const {passwordPolicy} = require('login.dfe.validation');
const {migrateInvitationToUser} = require('./orchestrations');
const validate = (newPassword, confirmPassword) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter your new password';
    failed = true;
  }
  else if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
    messages.newPassword = 'Your password does not meet the minimum requirements';
    failed = true;
  }

  if (confirmPassword.length === 0) {
    messages.confirmPassword = 'Please confirm your new password';
    failed = true;
  } else if (newPassword !== confirmPassword) {
    messages.confirmPassword = 'Passwords do not match';
    failed = true;
  }

  return {
    failed,
    messages,
  };
};

const handler = async (req, res) => {
  let newPassword = req.body.newPassword;
  let confirmPassword = req.body.confirmPassword;
  const validationResult = validate(newPassword, confirmPassword);

  if (validationResult.failed) {
    return res.render('newPassword/views/newPassword', {
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages,
    });

  }
  const invitationId = req.session.invitation.id;

  // create a user
  // copy all the org and service links
  // mark the invitation as complete
  const user = await migrateInvitationToUser(invitationId, newPassword);
  req.session.invitation = {};
  req.session.user = {
    id: user.id,
    email: user.email
  };
  // redirect to the complete page
  res.redirect('/complete');
};

module.exports = handler;

