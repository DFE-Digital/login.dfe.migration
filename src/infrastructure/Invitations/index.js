const DirectoriesApiAccount = require('./DirectoriesApiInvitations');
const StaticAccount = require('./StaticInvitations');
const config = require('./../config')();

let account;
if(config.directories.type.toLowerCase() === 'api') {
  account = DirectoriesApiAccount;
} else {
  account = StaticAccount;
}
module.exports = account;