/*******************************************************************************
DigiBird retreival of Natuurbeelden collection metadata

This is the server backend to connect to the BenG Elastic Search instance
containing the Natuurbeelden video collections.

The script can be run individually with the following command:
node ./src/middlewares/natuurbeelden.js

*******************************************************************************/

var http = require('http');
var request = require('request');
var winston = require('winston');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');

module.exports = {
    getBenGMetadata: function() {

      //Lets configure and request
      request({
          url: 'http://in.beeldengeluid.nl/collectie/search/', //URL to hit
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          qs: {
            q: '',
            publiclyViewableResultsOnly: 'true'
          }, //Query string data
          //Lets post the following key/values as form
          json: {
            "phrase":"bird",
            "page":"1",
            "numkeyframes":5,
            "sorting":"SORT-DEF",
            "mediaType":"ALL_MEDIA",
            "pagesize":12,
            "startdate":null,
            "enddate":null,
            "publiclyViewableResultsOnly":"true",
            "digitalViewableResultsOnly":"false",
            "termFilters":"{}"
          }
      }, function(error, response, body){
          if(error) {
              console.log(error);
          } else {
              console.log(response.statusCode, body);
          }
      });
    }
}
        // // options to indicate where the post request is made
        // var postOptions = {
        //   host: 'in.beeldengeluid.nl',
        //   port: 80,
        //   path: '/collectie/search/?q=&publiclyViewableResultsOnly=true',
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json;charset=utf-8',
        //     'Content-Length': Buffer.byteLength(postData)
        //   }
        // }
