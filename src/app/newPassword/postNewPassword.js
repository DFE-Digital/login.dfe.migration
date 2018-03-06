'use strict';

const { passwordPolicy } = require('login.dfe.validation');
const { migrateInvitationToUser } = require('./orchestrations');
const logger = require('./../../infrastructure/logger');

const validate = (newPassword, confirmPassword) => {
  const messages = {};
  let failed = false;

  if (newPassword.length === 0) {
    messages.newPassword = 'Please enter your new password';
    failed = true;
  } else if (!passwordPolicy.doesPasswordMeetPolicy(newPassword)) {
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
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const validationResult = validate(newPassword, confirmPassword);

  if (validationResult.failed) {
    return res.render('newPassword/views/newPassword', {
      title: 'Create a new password for your DfE Sign-in account',
      csrfToken: req.csrfToken(),
      newPassword: '',
      confirmPassword: '',
      validationFailed: true,
      validationMessages: validationResult.messages,
    });
  }
  const invitationId = req.session.invitation.id;
  const serialNumber = req.session.invitation.tokenSerialNumber;

  // create a user
  // copy all the org and service links
  // mark the invitation as complete
  const user = await migrateInvitationToUser(invitationId, newPassword, serialNumber, req.id);
  req.session.completedInvitation = req.session.invitation;
  req.session.invitation = {};
  req.session.user = {
    id: user.sub,
    email: user.email,
  };

  logger.audit(`User ${user.email}  from invitationid: ${invitationId} created and linked to token "${serialNumber}"`, {
    type: 'migration',
    subType: 'user-created',
    success: true,
    userId: user.sub,
    invitationId,
    userEmail: user.email,
    deviceSerialNumber: serialNumber,
  });

  // redirect to the complete page
  return res.redirect('/complete');
};

module.exports = handler;

