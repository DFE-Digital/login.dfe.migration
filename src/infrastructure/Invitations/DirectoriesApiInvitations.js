const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');
const { createHash } = require('crypto');

const callDirectoriesApi = async (resource, body, method = 'POST') => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const opts = {
      method,
      uri: `${config.directories.service.url}/${resource}`,
      headers: {
        authorization: `bearer ${token}`,
      },
      json: true,
    };
    if (method === 'POST') {
      opts.body = body;
    }
    const result = await rp(opts);

    return {
      success: true,
      result,
    };
  } catch (e) {
    return {
      success: false,
      statusCode: e.statusCode,
      errorMessage: e.message,
    };
  }
};

const validateCredentials = (username, password, salt, osaUserName, osaPassword) => {
  const hash = createHash('sha512');
  hash.update(password + salt, 'utf8');
  const hashed = hash.digest('hex');
  return hashed === osaPassword && username.toLowerCase() === osaUserName.toLowerCase();
};

const getById = async (id) => {
  const response = await callDirectoriesApi(`invitations/${id}`, null, 'GET');
  if (!response.success) {
    if (response.statusCode === 404) {
      return null;
    }
    throw new Error(response.errorMessage);
  }
  return response.result;
};

const validateOsaCredentials = async (id, username, password) => {
  const invitation = await getById(id);

  if (!invitation) {
    return null;
  }

  if (!invitation.oldCredentials || !invitation.oldCredentials.username || !invitation.oldCredentials.password || !invitation.oldCredentials.salt) {
    return null;
  }

  const result = validateCredentials(username, password, invitation.oldCredentials.salt, invitation.oldCredentials.username, invitation.oldCredentials.password);

  if (result === false) {
    return null;
  }

  return {
    id: invitation.id,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    email: invitation.email,
  };
};

const createUser = async (invitationId, password) => {
  const response = await callDirectoriesApi(`invitations/${invitationId}/create_user`, {
    password,
  });

  return response.success ? response.result : false;
};

module.exports = {
  getById,
  validateOsaCredentials,
  createUser,
};
