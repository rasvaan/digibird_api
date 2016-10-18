/*******************************************************************************
DigiBird object information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var interpret = require('../helpers/request_interpretation');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var waisda = require('../middlewares/waisda');
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
    console.log("in get, parameters:", parameters);

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
      case 'waisda': {
        return waisda.request(parameters).then((aggregations) => {
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
        const filter = interpret.mergeQueryParameters(parameters);
        const query = this.sparqlObjectQueries(filter)['edm_filter_desciption'];

        return tripleStore.query(platform, query.query).then((values) => {
          return _this.processSparqlAggregations(values, 'dctype:Image');
        }).then((aggregations) => {
          return new Results(aggregations, [platform]);
        });
      }
      case 'accurator': {
        const queryConcept = interpret.iocConceptFromInput(parameters);
        const query = this.sparqlObjectQueries(queryConcept)['edm_concept_annotation'];

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
  processSparqlAggregations: function(results, type) {
    /* extract results from sparql objects, consider:
    *  - duplicate results -> merge into one objects
    *  - duplicate values property object -> make value an array of values
    */
    let aggregations = [];
    let uris = []; // book keepping

    for (let i=0; i<results.length; i++) {
      const result = results[i];
      const index = uris.indexOf(result.aggregation.value);

      // see if already present in aggregations
      if (index < 0) {
        // unknown uri, add to array and create a new aggregation
        uris.push(result.aggregation.value);
        let culturalObject = new CulturalObject(result.object.value);
        let webResource = new WebResource(result.view.value, type);

        // extend information object when possible
        if (result.creator) culturalObject.addCreator(result.creator.value);
        if (result.title) culturalObject.addTitle(result.title.value);

        let aggregation = new Aggregation(
          result.aggregation.value,
          culturalObject,
          webResource
        );

        aggregation.addLicense(result.rights.value);
        aggregations[aggregations.length] = aggregation;
      } else {
        // TODO: extend current data in a sensible way (duplicate values)
      }
    }

    return aggregations;
  },
  sparqlObjectQueries: function() {
    // create an object with queries that can be used to retrieve objects
    const queries =
    {
        "edm_filter_desciption":
          {
            "query":
              "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
              "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
              "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
              "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
              "SELECT DISTINCT ?aggregation ?rights ?object ?view ?title ?creator " +
              "WHERE {" +
                "?object rdf:type edm:ProvidedCHO . " +
                "?object dc:description ?description . " +
                `FILTER ( lang(?description) = "nl" && regex(?description, " ${arguments[0]} ", "i") ) ` +
                "?aggregation edm:aggregatedCHO ?object . " +
                "?aggregation edm:isShownBy ?view . " +
                "?aggregation edm:rights ?rights . " +
                "OPTIONAL { " +
                "  ?object dc:title ?title . " +
                "   FILTER ( lang(?title) = \"en\" ) " +
                "} " +
                "OPTIONAL { " +
                "  ?object dc:creator ?creatorId . " +
                "  ?creatorId skos:prefLabel ?creator . " +
                "  FILTER ( lang(?creator) = \"en\" ) " +
                "} " +
              "} ",
            "name": "description filter"
          },
        "edm_concept_annotation":
          {
            "query":
              "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
              "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
              "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
              "PREFIX oa: <http://www.w3.org/ns/oa#> " +
              "SELECT ?aggregation ?rights ?object ?view ?title ?creator " +
              "WHERE { " +
                `?annotation oa:hasBody <${arguments[0]}> . ` +
                "?annotation oa:hasTarget ?object . " +
                "?object rdf:type edm:ProvidedCHO . " +
                "?aggregation edm:aggregatedCHO ?object . " +
                "?aggregation edm:isShownBy ?view . " +
                "?aggregation edm:rights ?rights . " +
                "OPTIONAL { " +
                "  ?object dc:title ?title . " +
                "   FILTER ( lang(?title) = \"en\" ) " +
                "} " +
                "OPTIONAL { " +
                "  ?object dc:creator ?creatorId . " +
                "  ?creatorId skos:prefLabel ?creator . " +
                "  FILTER ( lang(?creator) = \"en\" ) " +
                "} " +
              "} ",
            "name": "description filter"
          }
    }

    return queries;
  }
}
