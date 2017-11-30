'use strict';

const Invitations = require('./../../../infrastructure/Invitations');

const handler = (invitationId, password) => Invitations.createUser(invitationId, password);

module.exports = handler;
