const Invitation = require('./Invitation');
const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const config = require('./../config');
const {createHash} = require('crypto');

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

const validateCredentials = async (username, password, salt, osaUserName, osaPassword) => {
  const hash = createHash('sha512');
  hash.update(password + salt, 'utf8');
  const hashed = hash.digest('hex');
  return hashed === osaPassword && username.toLowerCase() === osaUserName.toLowerCase();

};

class InvitationsApiAccount extends Invitation {

  static async getById(id) {
    const response = await callDirectoriesApi(`invitations/${id}`, null, 'GET');
    if (!response.success) {
      if (response.statusCode === 404) {
        return null;
      }
      throw new Error(response.errorMessage);
    }
    return response.result;
  }

  static async validateOsaCredentials(id, username, password) {

    const invitation = await this.getById(id);

    if (!invitation) {
      return false;
    }

    if (!invitation.username || !invitation.password || !invitation.salt) {
      return false
    }

    return await validateCredentials(username, password,invitation.salt, invitation.username, invitation.password);

  }

}

module.exports = InvitationsApiAccount;