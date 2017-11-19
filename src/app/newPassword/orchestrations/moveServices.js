'use strict';

const { migrateInvitationServicesToUserServices } = require('./../../../infrastructure/organisations');

const handler = async (invitationId, userId) => {
  await migrateInvitationServicesToUserServices(invitationId, userId);
  return true;
};

module.exports = handler;