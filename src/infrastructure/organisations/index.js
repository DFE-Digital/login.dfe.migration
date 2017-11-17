const config = require('./../config');
let organisations;

if (config.organisations.type.toLowerCase() === 'static') {
  organisations = require('./staticOrganisations');
} else if (config.organisations.type.toLowerCase() === 'api') {
  organisations = require('./organisationsApi');
} else {
  throw new Error(`Unknown organisations type ${config.organisations.type}`);
}

module.exports = organisations;