const config = require('./../config');
const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const logger = require('./../logger');

const syncDigipassToken = async (serialNumber, code1, code2) => {
  const token = await jwtStrategy(config.devices.service).getBearerToken();
  try {
    const response = await rp({
      method: 'POST',
      uri: `${config.devices.service.url}/digipass/${serialNumber}/sync`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        code1,
        code2,
      },
      json: true,
    });

    return response.valid;
  } catch (e) {
    if (e.statusCode === 400) {
      logger.error('Invalid request to sync device, code 1 and code 2 must be supplied');
      return null;
    } else if (e.statusCode === 404) {
      logger.error('Serial number does not exist');
      return null;
    }
    throw e;
  }
};

module.exports = {
  syncDigipassToken,
};
