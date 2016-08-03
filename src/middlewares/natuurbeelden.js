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

      // configuration of POST and sending the request
      request({
          url: 'http://in.beeldengeluid.nl/collectie/search', // URL to hit
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          qs: {
            q: 'bird',
            page: '1',
            publiclyViewableResultsOnly: 'true',
            digitalViewableResultsOnly: 'false'
          }, // query string data
          body: {
            phrase:'bird',
            page:'1',
            numkeyframes:5,
            sorting:'SORT-DEF',
            mediaType:'ALL_MEDIA',
            pagesize:12,
            startdate:null,
            enddate:null,
            publiclyViewableResultsOnly:'true',
            digitalViewableResultsOnly:'false',
            termFilters:'{}'
          }, // body of the request
          json: true // json serialization on the body object
      }, function(error, response, body){
          if(error) {
              console.log(error);
          } else {
              console.log(response.statusCode, body);
          }
      });
    }
}
