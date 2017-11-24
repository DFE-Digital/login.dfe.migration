'use strict';

const Invitations = require('./../../../infrastructure/Invitations');

const handler = async (invitationId, password) => {
  return Invitations.createUser(invitationId, password);
};

module.exports = handler;