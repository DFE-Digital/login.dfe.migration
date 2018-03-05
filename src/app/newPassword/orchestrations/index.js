'use strict';

const logger = require('./../../../infrastructure/logger');
const createUserFromInvitationWithPassword = require('./createUser');
const moveServicesFromInvitationToUser = require('./moveServices');
const createUserDevice = require('./createUserDevice');

const migrateInvitationToUser = async (invitationId, password, serialNumber, correlationId) => {
  if (!invitationId) {
    throw new Error('InvitationId Missing or invalid');
  }
  if (!password) {
    throw new Error('Password missing or invalid');
  }

  try {
    const user = await createUserFromInvitationWithPassword(invitationId, password);
    await moveServicesFromInvitationToUser(invitationId, user.id);

    if (serialNumber) {
      await createUserDevice(user.id, serialNumber, correlationId);
    }

    return user;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

module.exports = {
  migrateInvitationToUser,
};
