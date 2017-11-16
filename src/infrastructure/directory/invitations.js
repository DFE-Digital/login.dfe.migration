const Account = require('./Account');
const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');

const callDirectoriesApi = async (resource, body, method = 'POST') => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const opts = {
      method,
      uri: `${config.directories.service.url}/${resource}`,
      headers: {
        authorization: `bearer ${token}`
      },
      json: true
    };
    if (method === 'POST') {
      opts.body = body;
    }
    const result = await rp(opts);

    return {
      success: true,
      result
    };
  } catch (e) {
    return {
      success: false,
      statusCode: e.statusCode,
      errorMessage: e.message
    };
  }
};


const createUser = async (invitationId, password) =>
{
  const response = await callDirectoriesApi(`invitations/${invitationId}/create_user`, {
    password
  });

  return response.success ? response.result : false;
};


module.exports = {createUser};