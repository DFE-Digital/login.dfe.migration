const config = require('./../config');
const KeepAliveAgent = require('agentkeepalive').HttpsAgent;
const rp = require('request-promise').defaults({
  agent: new KeepAliveAgent({
    maxSockets: config.hostingEnvironment.agentKeepAlive.maxSockets,
    maxFreeSockets: config.hostingEnvironment.agentKeepAlive.maxFreeSockets,
    timeout: config.hostingEnvironment.agentKeepAlive.timeout,
    keepAliveTimeout: config.hostingEnvironment.agentKeepAlive.keepAliveTimeout,
  }),
});
const jwtStrategy = require('login.dfe.jwt-strategies');
const { createHash } = require('crypto');

const callDirectoriesApi = async (resource, body, method = 'POST', correlationId) => {
  const token = await jwtStrategy(config.directories.service).getBearerToken();
  try {
    const opts = {
      method,
      uri: `${config.directories.service.url}/${resource}`,
      headers: {
        authorization: `bearer ${token}`,
        'x-correlation-id': correlationId,
      },
      json: true,
    };
    if (method !== 'GET') {
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

const checkIfEmailAlreadyInUse = async (emailAddress) => {
  const response = await callDirectoriesApi(`users/${emailAddress}`, null, 'GET');
  if (!response.success) {
    if (response.statusCode === 404) {
      return false;
    }
    throw new Error(response.errorMessage);
  }
  return true;
};

const markInvitationAsComplete = async (id) => {
  await callDirectoriesApi(`invitations/${id}`, { isCompleted: true }, 'PATCH');
};

const createUserDevice = async (id, serialNumber, correlationId) => {
  await callDirectoriesApi(`users/${id}/devices`, { type: 'digipass', serialNumber }, 'POST', correlationId);
};

module.exports = {
  getById,
  validateOsaCredentials,
  createUser,
  checkIfEmailAlreadyInUse,
  markInvitationAsComplete,
  createUserDevice,
};
