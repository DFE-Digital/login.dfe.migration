'use strict';

const { createUserDevice } = require('./../../../infrastructure/Invitations');

const handler = async (userId, serialNumber, correlationId) => {
  await createUserDevice(userId, serialNumber, correlationId);
};

module.exports = handler;
