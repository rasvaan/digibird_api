/*******************************************************************************
Triple store middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');

module.exports = {
    query: function(platform, query) {
        // query the platforms endpoint
        var options = {
            url: platform.endpoint_location,
            method: 'POST', // using post with query as body, get might be more generic?
            headers: {
                'Accept': 'application/sparql-results+json',
                'Content-Type': 'application/sparql-query'
            },
            body: query
        };

        return request(options)
        .then(function(response) {
            var value = JSON.parse(response).results.bindings[0].result.value;
            var name = queries[statistic].name;

            return { "type": name, "value": value };
        });
    },
    countQuery: function(platform, query) {
        // query the platforms endpoint
        var options = {
            url: platform.endpoint_location,
            method: 'POST', // using post with query as body, get might be more generic?
            headers: {
                'Accept': 'application/sparql-results+json',
                'Content-Type': 'application/sparql-query'
            },
            body: query
        };

        return request(options)
        .then(function(response) {
            // not completely generic since the value id is dependending on how the query is formulated
            return JSON.parse(response).results.bindings[0].result.value;
        });
    }
}
