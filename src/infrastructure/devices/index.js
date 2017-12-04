/* eslint-disable global-require */
const config = require('./../config');

let adapter;
if (config.devices.type === 'static') {
  adapter = require('./static');
} else if (config.devices.type === 'api') {
  adapter = require('./devicesApi');
}
module.exports = adapter;