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
    getBenGMetadata: function() {
      var URL = 'http://in.beeldengeluid.nl/collectie/api/search/';
      var searchPhrase = 'bird';
      var requestBody = {
        phrase:searchPhrase,
        page:'1',
        numkeyframes:5,
        sorting:'SORT-DEF',
        mediaType:'ALL_MEDIA',
        pagesize:12,
        startdate:null,
        enddate:null,
        publiclyViewableResultsOnly:'true',
        digitalViewableResultsOnly:'false',
        termFilters:{}
      };
      // configuration of POST request
      var options = {
        method: 'POST',
        uri: URL, // URL to hit
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: requestBody,//JSON.stringify(requestBody), // body of the request
        json: true // json serialization on the body = stringifies body to JSON
      };

      request(options)
      .then(function (response) {
        console.log("PARSED BODY!!! start /n ========================= /n");
        console.log(response);
        console.log("PARSED BODY!!! end /n ========================= /n");

      })
      .catch(function (error) {
        console.log("ERROR!!! start /n ========================= end /n", error);
      });
    }
}
