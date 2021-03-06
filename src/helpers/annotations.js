/*******************************************************************************
DigiBird annotation information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var interpret = require('../helpers/request_interpretation');
var objects = require('../helpers/objects');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var waisda = require('../middlewares/waisda');
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
      case 'waisda': {
        return waisda.request(parameters);
      }
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
        const limit = 60;
        const query = this.sparqlAnnotationQueries(limit)['edm_sorted_annotation'];

        return tripleStore.query(parameters.platform, query.query).then((values) => {
          let aggregations = objects.processSparqlAggregations(values, 'dctype:Image');
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
      case 'waisda': {
        return waisda.request(parameters);
      }
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
      case 'accurator': {
        const sparqlDate = parameters.date.toISOString();
        const query = this.sparqlAnnotationQueries(sparqlDate)['edm_time_annotation'];

        return tripleStore.query(parameters.platform, query.query).then((values) => {
          let aggregations = objects.processSparqlAggregations(values, 'dctype:Image');
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
  processSparqlAnnotations: function(results) {
    /* extract annotations from sparql objects
    */
    let annotations = [];
    let uris = []; // book keepping

    for (let i=0; i<results.length; i++) {
      const result = results[i];
      const index = uris.indexOf(result.annotation.value);

      // see if already present in aggregations
      if (index < 0) {
        // unknown uri, add to array and create a new aggregation
        uris.push(result.annotation.value);

        if (result.label) {
          let annotation = new Annotation(
            result.annotation.value,
            result.object.value,
            result.label.value
          );

          if (result.date) annotation.addDate(result.date.value);

          annotations.push(annotation);
        }
      }
    }

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
          "SELECT ?aggregation ?annotation ?date ?label ?rights ?object ?view  ?label ?title ?creator " +
          "WHERE { " +
            "?annotation oa:hasBody ?body . " +
            "?annotation oa:hasTarget ?object . " +
            "?annotation oa:annotatedAt ?date . " +
            "?aggregation edm:aggregatedCHO ?object . " +
            "?aggregation edm:isShownBy ?view . " +
            "?aggregation edm:rights ?rights . " +
            "?object rdf:type <http://accurator.nl/bird#Target> . " +
            "?object dc:title ?title . " +
            "OPTIONAL { " +
              "?body rdf:type cnt:ContentAsText . " +
              "?body cnt:chars ?label . " +
            "} " +
            "OPTIONAL { " +
              "?body rdf:type skos:Concept . " +
              "?body skos:prefLabel ?label . " +
            "} " +
            "OPTIONAL { " +
              "?object dc:creator ?creatorId . " +
              "?creatorId skos:prefLabel ?creator . " +
              "FILTER ( lang(?creator) = \"en\" ) " +
            "} " +
          "} " +
          "ORDER BY DESC(?date) " +
          `LIMIT ${arguments[0]}`,
          "name": "annotations sorted by date"
        },
        "edm_time_annotation":
          {
            "query":
              "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
              "PREFIX ore: <http://www.openarchives.org/ore/terms/> " +
              "PREFIX dc: <http://purl.org/dc/elements/1.1/> " +
              "PREFIX oa: <http://www.w3.org/ns/oa#> " +
              "SELECT DISTINCT ?aggregation ?annotation ?date ?rights ?object ?view ?label ?title ?creator " +
              "WHERE { " +
                "?annotation oa:hasBody ?body . " +
                "?annotation oa:hasTarget ?object . " +
                "?annotation oa:annotatedAt ?date . " +
                "?aggregation edm:aggregatedCHO ?object . " +
                "?aggregation edm:isShownBy ?view . " +
                "?aggregation edm:rights ?rights . " +
                "?object rdf:type <http://accurator.nl/bird#Target> . " +
                "?object dc:title ?title . " +
                "OPTIONAL { " +
                  "?body rdf:type cnt:ContentAsText . " +
                  "?body cnt:chars ?label . " +
                "} " +
                "OPTIONAL { " +
                  "?body rdf:type skos:Concept . " +
                  "?body skos:prefLabel ?label . " +
                "} " +
                "OPTIONAL { " +
                  "?object dc:creator ?creatorId . " +
                  "?creatorId skos:prefLabel ?creator . " +
                  "FILTER ( lang(?creator) = \"en\" ) " +
                "} " +
                `FILTER (?date > "${arguments[0]}"^^xsd:dateTime) ` +
              "} ",
            "name": "annotations since date"
          }
    }

    return queries;
  }
}
