'use strict';

const { createUser, markInvitationAsComplete } = require('./../../../infrastructure/Invitations');

const handler = async (invitationId, password) => {
  const user = await createUser(invitationId, password);
  await markInvitationAsComplete(invitationId);
  return user;
};

module.exports = handler;
