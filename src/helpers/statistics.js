/*******************************************************************************
DigiBird meta information component
*******************************************************************************/
var platforms = require('./platforms');
var request = require('request-promise-native');
var winston = require('winston');
var xenoCanto = require('../middlewares/xeno-canto-api');
var tripleStore = require('../middlewares/triple-store');

module.exports = {
    // return a promise of statistics of the platform
    statistics: function(platformId) {
        var platform = platforms.platform(platformId);

        if (platform.endpoint_type === "json-api") {
            return this.statisticsApi(platform);
        } else if (platform.endpoint_type === "sparql") {
            var promises = [];

            for (var i=0; i<platform.statistics.length; i++)
                promises[i] = this.statisticsTripleStore(platform, platform.statistics[i]);

            return Promise.all(promises)
            .then(function(statistics) {
                return statistics;
            });
        } else {
            // stub for not yet added platforms
            return new Promise(function(resolve, reject) {
                resolve([{ "type": "Not yet available", "value": ""}]);
            });
        }

        return statistics;
    },
    statisticsApi: function(platform) {
        if (platform.id === "xeno-canto") {
            // formulate query
            var query = "cnt:netherlands";

            return xenoCanto.request(query)
            .then(function(data) {
                return [{ "type": "Dutch contributions", "value": data.numRecordings }];
            });
        } else {
            // stub for not yet added apis
            return new Promise(function(resolve, reject) {
                resolve([{ "type": "Not yet available", "value": ""}]);
            });
        }
    },
    statisticsTripleStore: function(platform, statistic) {
        var query = this.sparqlStatisticsQueries()[statistic];

        return tripleStore.countQuery(platform, query.query)
        .then(function(value) {
            return { "type": query.name, "value": value };
        });
    },
    sparqlStatisticsQueries: function() {
        // create an object with queries that can be used for monitor purposes
        var queries =
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
            "users":
                {
                    "query":
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?user) as ?result) " +
                        "WHERE { " +
                            "?annotation oa:hasTarget ?work . " +
                            "?annotation oa:annotatedBy ?user . " +
                        "}",
                    "name": "total contributors"
                },
            "users_birds":
                {
                    "query":
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?user) as ?result) " +
                        "WHERE { " +
                            "?annotation oa:hasTarget ?object . " +
                            "?object rdf:type <http://accurator.nl/bird#Target> . " +
                            "?annotation oa:annotatedBy ?user . " +
                        "}",
                    "name":"contributors"
                },
            "annotations":
                {
                    "query":
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?annotation) as ?result) " +
                        "WHERE { " +
                            "?annotation rdf:type oa:Annotation . " +
                        "}",
                    "name": "annotations"
                },
            "annotations_birds":
                {
                    "query":
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?annotation) as ?result) " +
                        "WHERE { " +
                            "?annotation oa:hasTarget ?object . " +
                            "?object rdf:type <http://accurator.nl/bird#Target> . " +
                            "?annotation rdf:type oa:Annotation . " +
                        "}",
                    "name": "annotations"
                },
            "objects":
                {
                    "query":
                        "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?object) as ?result) " +
                        "WHERE { ?object rdf:type edm:ProvidedCHO . }",
                    "name": "objects"
                },
            "objects_birds":
                {
                    "query":
                        "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?object) as ?result) " +
                        "WHERE { " +
                            "?object rdf:type edm:ProvidedCHO . " +
                            "?object rdf:type <http://accurator.nl/bird#Target> . " +
                        "}",
                    "name": "objects"
                },
            "annotated_objects":
                {
                    "query":
                        "PREFIX edm: <http://www.europeana.eu/schemas/edm/> " +
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?object) as ?result) " +
                        "WHERE { " +
                            "?annotation oa:hasTarget ?object . " +
                            "?object rdf:type edm:ProvidedCHO . " +
                            "?annotation rdf:type oa:Annotation . " +
                        "}",
                    "name": "annotated objects"
                },
            "annotated_objects_birds":
                {
                    "query":
                        "PREFIX oa: <http://www.w3.org/ns/oa#> " +
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
                        "SELECT (COUNT(DISTINCT ?object) as ?result) " +
                        "WHERE { " +
                            "?annotation oa:hasTarget ?object . " +
                            "?object rdf:type <http://accurator.nl/bird#Target> . " +
                            "?annotation rdf:type oa:Annotation . " +
                        "}",
                    "name": "annotated objects"
                }
        };

        return queries;
    }
}
