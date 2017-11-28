const DirectoriesApiInvitations = require('./DirectoriesApiInvitations');
const StaticInvitations = require('./StaticInvitations');
const config = require('./../config');

let account;
if (config.directories.type.toLowerCase() === 'api') {
  account = DirectoriesApiInvitations;
} else {
  account = StaticInvitations;
}
module.exports = account;
