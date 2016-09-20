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
var Aggregation = require('../classes/Aggregation');
var CulturalObject = require('../classes/CulturalObject');
var WebResource = require('../classes/WebResource');

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
          return new Results(aggregations, [platform]);
        });
      }
      case 'xeno-canto': {
        return xenoCanto.request(parameters).then((aggregations) => {
          return new Results(aggregations, [platform]);
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
    let _this = this;

    switch(platform.id) {
      case 'rijksmuseum': {
        // only filter, since we have no suitable concepts to query for
        const filter = this.mergeQueryParameters(parameters);
        const query = this.sparqlObjectQueries(filter)['filter_desciption'];

        return tripleStore.query(platform, query.query).then((values) => {
          return _this.processSparqlAggregations(values, 'dctype:Image');
        }).then((aggregations) => {
          return new Results(aggregations, [platform]);
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
  mergeQueryParameters: function(parameters) {
    // merge the parameters if we can not query for specifc concepts
    switch(parameters.request) {
      case 'genus': return parameters.genus;
      case 'species': return `${parameters.genus} ${parameters.species}`;
      case 'common': return parameters.common_name;
    }
    // TODO: for the Rijksmuseum translate scientific names to common?
  },
  processSparqlAggregations: function(results, type) {
    let aggregations = [];

    for (let i=0; i<results.length; i++) {
      const result = results[i];

      aggregations[aggregations.length] = new Aggregation(
        result.aggregation.value,
        new CulturalObject(result.object.value),
        new WebResource(result.view.value, type)
      );
    }

    return aggregations;
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
        },
      "edm_objects":
        {
          "query":
            "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
            "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
            "SELECT ?object ?image " +
            "WHERE {" +
              "?object rdf:type edm:ProvidedCHO . " +
              "?aggregation edm:aggregatedCHO ?object . " +
              "?aggregation edm:isShownBy ?image . " +
            "} " +
            "LIMIT 10",
          "name": "edm objects"
        },
        "filter_desciption":
          {
            "query":
              "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
              "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
              "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
              "SELECT ?aggregation ?object ?view " +
              "WHERE {" +
                "?object rdf:type edm:ProvidedCHO . " +
                "?aggregation edm:aggregatedCHO ?object . " +
                "?aggregation edm:isShownBy ?view . " +
                "?object dc:description ?description . " +
                `FILTER regex(?description, \"${arguments[0]}\", \"i\") ` +
              "} " +
              "LIMIT 10",
            "name": "description filter"
          }
    }

    return queries;
  }
}
