/*******************************************************************************
DigiBird object information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var winston = require('winston');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var tripleStore = require('../middlewares/triple-store');
var Results = require('../classes/Results');

module.exports = {
  get: function(parameters) {
    /* Execute a list of promises obtaining objects
     *
     * Create promises based on provided parameters. It is possible to request
     * integrated results from multiple platforms at once, hence the loop through
     * the platforms parameter.
     */
    let promises = [];

    for (let i=0; i<parameters.platforms.length; i++) {
      const platform = platformMetadata.platform(parameters.platforms[i]);
      switch(platform.endpoint_type) {
        case 'json-api': {
          promises[i] = this.objectsApi(platform.id, parameters);
          break;
        }
        default: {
          promises[i] = new Promise(function(resolve, reject) {
            const error = new Error(
              `${platform.endpoint_type} for ${platform.id} is not yet available`
            );
            reject(error);
          });
        }
      }
    }

    return Promise.all(promises);
  },
  objectsApi: function(platformId, parameters) {
    switch (platformId) {
      case 'soortenregister': {
        return soortenRegister.request(parameters).then((aggregations) => {
          let soortenResults = new Results();
          soortenResults.addAggregations(aggregations);
          soortenResults.addPlatform('soortenregister');
          return soortenResults;
        });
      }
      case 'xeno-canto': {
        return xenoCanto.request(parameters).then((aggregations) => {
          let xenoResults = new Results();
          xenoResults.addAggregations(aggregations);
          xenoResults.addPlatform('xeno-canto');
          return xenoResults;
        });
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`${platformId} is not yet available`);
          reject(error);
        });
      }
    }
  }
}
