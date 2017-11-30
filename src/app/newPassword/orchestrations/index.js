'use strict';

const logger = require('./../../../infrastructure/logger');
const createUserFromInvitationWithPassword = require('./createUser');
const moveServicesFromInvitationToUser = require('./moveServices');

const migrateInvitationToUser = async (invitationId, password) => {
  if (!invitationId) {
    throw new Error('InvitationId Missing or invalid');
  }
  if (!password) {
    throw new Error('Password missing or invalid');
  }

  try {
    const user = await createUserFromInvitationWithPassword(invitationId, password);
    await moveServicesFromInvitationToUser(invitationId, user.id);
    return user;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = {
  migrateInvitationToUser,
};
