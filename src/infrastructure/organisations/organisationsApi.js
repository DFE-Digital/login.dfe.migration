const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');

const getServicesForInvitation = async (invitationId) => {
  try {
    const token = await jwtStrategy(config.organisations.service).getBearerToken();

    return await rp({
      method: 'GET',
      uri: `${config.organisations.service.url}/invitations/${invitationId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return null;
    }
    throw e;
  }
};

const migrateInvitationServicesToUserServices = async (invitationId, userId) => {
  try {
    const token = await jwtStrategy(config.organisations.service).getBearerToken();

    return await rp({
      method: 'POST',
      uri: `${config.organisations.service.url}/invitations/${invitationId}/migrate-to-user`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        user_id: userId,
      },
      json: true,
    });
  } catch (e) {
    if (e.statusCode === 404) {
      return null;
    }
    throw e;
  }
};

module.exports = {
  getServicesForInvitation,
  migrateInvitationServicesToUserServices,
};
