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
var Annotation = require('../classes/Annotation');

module.exports = {
  get: function(parameters) {
    switch(parameters.platform.endpoint_type) {
      case 'json-api': {
        return this.annotationsApi(parameters);
      }
      case 'sparql': {
        return this.annotationsTripleStore(parameters);
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(
            `${parameters.platform.endpoint_type} for ${parameters.platform.id} is not yet available`
          );
          reject(error);
        });
      }
    }
  },
  since: function(parameters) {
    switch(parameters.platform.endpoint_type) {
      case 'json-api': {
        return this.annotationsSinceApi(parameters);
      }
      case 'sparql': {
        return this.annotationsSinceTripleStore(parameters);
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(
            `${parameters.platform.endpoint_type} for ${parameters.platform.id} is not yet available`
          );
          reject(error);
        });
      }
    }
  },
  annotationsApi: function(parameters) {
    switch (parameters.platform.id) {
      // case 'waisda': {
      //   return waisda.request(parameters).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsTripleStore: function(parameters) {
    let _this = this;

    switch(parameters.platform.id) {
      case 'accurator': {
        const limit = 10;
        const query = this.sparqlAnnotationQueries(limit)['edm_sorted_annotation'];

        return tripleStore.query(parameters.platform, query.query).then((values) => {
          let aggregations = _this.processSparqlAggregations(values, 'dctype:Image');
          let annotations = _this.processSparqlAnnotations(values);
          let combined = aggregations.concat(annotations);
          return new Results(combined, [parameters.platform]);
        });
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsSinceApi: function(parameters) {
    switch (parameters.platform.id) {
      // case 'waisda': {
      //   return waisda.request(parameters).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsSinceTripleStore: function(parameters) {
    let _this = this;

    switch(parameters.platform.id) {
      // case 'accurator': {
      //   return tripleStore.query(platform, query.query).then((values) => {
      //     return _this.processSparqlAggregations(values, 'dctype:Image');
      //   }).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
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
  processSparqlAnnotations: function(results) {
    /* extract annotations from sparql objects, consider:
    */
    let annotations = [];
    let uris = []; // book keepping

    let annotation = new Annotation('http://anno.nl', ':nightwatch', 'kip');
    annotations.push(annotation);
    // for (let i=0; i<results.length; i++) {
    //   const result = results[i];
    //   const index = uris.indexOf(result.aggregation.value);
    //
    //   // see if already present in aggregations
    //   if (index < 0) {
    //     // unknown uri, add to array and create a new aggregation
    //     uris.push(result.aggregation.value);
    //     let culturalObject = new CulturalObject(result.object.value);
    //     let webResource = new WebResource(result.view.value, type);
    //
    //     // extend information object when possible
    //     if (result.creator) culturalObject.addCreator(result.creator.value);
    //     if (result.title) culturalObject.addTitle(result.title.value);
    //
    //     let aggregation = new Aggregation(
    //       result.aggregation.value,
    //       culturalObject,
    //       webResource
    //     );
    //
    //     aggregation.addLicense(result.rights.value);
    //     aggregations[aggregations.length] = aggregation;
    //   } else {
    //     // TODO: extend current data in a sensible way (duplicate values)
    //   }
    // }

    return annotations;
  },
  sparqlAnnotationQueries: function() {
    // create an object with queries that can be used to retrieve objects
    const queries =
    {
      "edm_sorted_annotation":
        {
          "query":
          "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
          "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
          "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
          "PREFIX oa: <http://www.w3.org/ns/oa#> " +
          "PREFIX cnt: <http://www.w3.org/2011/content#> " +
          "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
          "PREFIX skos: <http://www.w3.org/2004/02/skos/core#> " +
          "SELECT ?aggregation ?dateAnnotated ?rights ?object ?view  ?label ?title ?creator " +
          "WHERE { " +
            "?annotation oa:hasBody ?body . " +
            "?annotation oa:hasTarget ?object . " +
            "?annotation oa:annotatedAt ?dateAnnotated . " +
            "?aggregation edm:aggregatedCHO ?object . " +
            "?aggregation edm:isShownBy ?view . " +
            "?aggregation edm:rights ?rights . " +
            "?object rdf:type <http://accurator.nl/bird#Target> . " +
            "OPTIONAL { " +
              "?body rdf:type cnt:ContentAsText . " +
              "?body cnt:chars ?label . " +
            "} " +
            "OPTIONAL { " +
              "?body rdf:type skos:Concept . " +
              "?body skos:prefLabel ?label . " +
              "FILTER ( lang(?title) = \"en\" ) " +
            "} " +
            "OPTIONAL { " +
              "?object dc:title ?title . " +
              "FILTER ( lang(?title) = \"en\" ) " +
            "} " +
            "OPTIONAL { " +
              "?object dc:creator ?creatorId . " +
              "?creatorId skos:prefLabel ?creator . " +
              "FILTER ( lang(?creator) = \"en\" ) " +
            "} " +
          "} " +
          "ORDER BY DESC(?dateAnnotated) " +
          "LIMIT 60",
          "name": "annotations sorted by date"
        }
    }

    return queries;
  }
}
