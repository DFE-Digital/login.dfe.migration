const config = require('./../config');
const StaticOrganisations = require('./staticOrganisations');
const ApiOrganisations = require('./organisationsApi');

let organisations;

if (config.organisations.type.toLowerCase() === 'static') {
  organisations = StaticOrganisations;
} else if (config.organisations.type.toLowerCase() === 'api') {
  organisations = ApiOrganisations;
} else {
  throw new Error(`Unknown organisations type ${config.organisations.type}`);
}

module.exports = organisations;
