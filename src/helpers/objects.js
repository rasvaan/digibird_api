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
          promises[i] = this.objectsApi(platform, parameters);
          break;
        }
        case 'sparql': {
          promises[i] = this.objectsTripleStore(platform, parameters);
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
  objectsApi: function(platform, parameters) {
    switch (platform.id) {
      case 'soortenregister': {
        return soortenRegister.request(parameters).then((aggregations) => {
          let soortenResults = new Results();
          soortenResults.addAggregations(aggregations);
          soortenResults.addPlatform(platform);
          return soortenResults;
        });
      }
      case 'xeno-canto': {
        return xenoCanto.request(parameters).then((aggregations) => {
          let xenoResults = new Results();
          xenoResults.addAggregations(aggregations);
          xenoResults.addPlatform(platform);
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
  },
  objectsTripleStore: function(platform, parameters) {
    console.log('retrieving objects from', platform.id, ' with parameters ', parameters);
    // const query = this.sparqlObjectQueries()[statistic];
    switch(platform.id) {
      case 'rijksmuseum': {
        const query = this.sparqlObjectQueries()['test'];
        console.log('Query', query);
        return tripleStore.query(platform, query.query).then(function(value) {
          console.log('results', value);
          // process the results
          let rijksmuseumResults = new Results();
          rijksmuseumResults.addPlatform(platform);
          return rijksmuseumResults;
        });
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`${platformId} is not yet available`);
          reject(error);
        });
      }
    }
  },
  sparqlObjectQueries: function() {
    // create an object with queries that can be used to retrieve objects
    const queries =
    {
      "test":
        {
          "query":
            "SELECT ?s ?p ?o " +
            "WHERE " +
              "{ ?s ?p ?o . } " +
            "LIMIT 10",
          "name": "test"
        }
    }

    return queries;
  }
}
