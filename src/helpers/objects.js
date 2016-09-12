/*******************************************************************************
DigiBird object information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var winston = require('winston');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var tripleStore = require('../middlewares/triple-store');

module.exports = {
  // return a promise of objects of the platform
  get: function(parameters) {
    const platform = platformMetadata.platform(parameters.platform);

    switch(platform.endpoint_type) {
      case 'json-api': return this.objectsApi(platform.id, parameters);
      default: {
        return new Promise(function(resolve, reject) {
          resolve({ "error": "Not yet available" });
        });
      }
    }
  },
  objectsApi: function(platformId, parameters) {
    switch (platformId) {
      case 'soortenregister': return soortenRegister.request(parameters);
      case 'xeno-canto': return xenoCanto.request(parameters);
      default: {
        return new Promise(function(resolve, reject) {
          resolve({ "error": "Not yet available" });
        });
      }
    }
  }
}
