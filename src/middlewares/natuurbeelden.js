/*******************************************************************************
DigiBird retreival of Natuurbeelden collection metadata

This is the server backend to connect to the BenG Elastic Search instance
containing the Natuurbeelden video collections.

The script can be run individually with the following command:
node ./src/middlewares/natuurbeelden.js

*******************************************************************************/

var http = require('http');
var winston = require('winston');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');
var credentials = require('./natuurbeelden_credentials');

module.exports = {
    getBenGMetadata: function() {

        // the post string for the request
        var postData = JSON.stringify({
          "phrase":"bird","page":"1","numkeyframes":5,"sorting":"SORT-DEF",
          "mediaType":"ALL_MEDIA","pagesize":12,"startdate":null,"enddate":null,
          "publiclyViewableResultsOnly":"true","digitalViewableResultsOnly":"false",
          "termFilters":"{}"
        });
        console.log('postData ok' );
        // options to indicate where the post request is made
        var postOptions = {
          host: 'in.beeldengeluid.nl',
          port: 80,
          path: '/collectie/search/?q=&publiclyViewableResultsOnly=true',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Content-Length': Buffer.byteLength(postData)
          }
        }

        // set up the POST request
        var postRequest = http.request(postOptions, function(response) {
           response.setEncoding('application/json');
           response.on('postData', function (chunk) {
               console.log('Response: ' + chunk);
           });
        });

         // post the data
         postRequest.write(postData);
         postRequest.end();

    }
}
