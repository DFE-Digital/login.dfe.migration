'use strict';
const {invitations} = require('./../../../infrastructure/directory');
const handler = async (invitationId, password) => {
  return await invitations.createUser(invitationId, password);
};

module.exports = handler;