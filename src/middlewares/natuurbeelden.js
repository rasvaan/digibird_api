/*******************************************************************************
DigiBird retreival of Natuurbeelden collection metadata

This is the server backend to connect to the BenG Elastic Search instance
containing the Natuurbeelden video collections.

The script can be run individually with the following command:
node ./src/middlewares/natuurbeelden.js

*******************************************************************************/

var http = require('http');
var request = require('request-promise-native');
var winston = require('winston');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');

module.exports = {
    searchBenGMetadata: function(searchPhrase) {
      var URL = 'http://in.beeldengeluid.nl/collectie/api/search/';

      var requestBody = {
        phrase: searchPhrase,
        // page: pageNo,
        // name: 'StatusCodeError',
        // numkeyframes: 5,
        // sorting: 'SORT-DEF',
        mediaType: 'VIDEO', //'ALL_MEDIA',
        pagesize: 12,
        // startdate: null,
        // enddate: null,
        publiclyViewableResultsOnly: 'true',
        // digitalViewableResultsOnly: 'false',
        // termFilters: {}
      };
      // configuration of POST request
      var options = {
        method: 'POST',
        uri: URL, // URL to hit
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: requestBody, // body of the request
        json: true // json serialization on the body = stringifies body to JSON
      };
      options.body.page = 1;

      request(options)
      .then(function (response) {
        console.log("PARSED BODY!!! start /n ========================= /n");
        console.log(response);
        console.log("PARSED BODY!!! end /n ========================= /n");
        var results = response.responseItems;
        console.log("Results: /n", results);
        var numResults = response.numResults;
        console.log("No.results:", numResults);
      })
      .catch(function (e) {
        winston.log('error',
            e.response.request.uri.href, //same as e.options.uri,
            e.name,e.statusCode, e.error.systemerror);
      });
    }
}
