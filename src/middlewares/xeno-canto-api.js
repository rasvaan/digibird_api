/*******************************************************************************
Xeno-canto API middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');

module.exports = {
    request: function(query) {
        // query the platforms endpoint
        var options = {
            url: platforms.platform("xeno-canto").endpoint_location,
            qs: { "query": query }
        };

        return request(options)
        .then(function(json) {
            return JSON.parse(json);
        });
    }
}
