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
    throw e;
  }
};

module.exports = {
  getServicesForInvitation,
};
