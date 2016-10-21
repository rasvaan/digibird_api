/*******************************************************************************
DigiBird annotation information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var interpret = require('../helpers/request_interpretation');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var tripleStore = require('../middlewares/triple-store');
var Results = require('../classes/Results');
var Aggregation = require('../classes/Aggregation');
var CulturalObject = require('../classes/CulturalObject');
var WebResource = require('../classes/WebResource');

module.exports = {
  get: function(parameters) {
    return new Promise(function(resolve, reject) {
      const error = new Error(
        `stuff should be implemented first`
      );
      reject(error);
    });
  },
  since: function(platform, parameters) {
    return new Promise(function(resolve, reject) {
      const error = new Error(
        `stuff should be implemented first`
      );
      reject(error);
    });
  }
}
