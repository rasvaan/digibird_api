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
var utils = require('../helpers/utils');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');

var URL = 'http://api2.video.beeldengeluid.videodock.com/api/2.0/guci/';

module.exports = {
    getVideoUrls: function(guciID) {

      // configuration of GET request
      var options = {
        method: 'GET',
        uri: URL + guciID, // URL to hit
        headers: {
          'Content-Type': 'application/json'
        },
        json: true // json serialization on the body = stringifies body to JSON
      };

      request(options)
      .then(function (response) {
        var videoUrls = {
          imageUrl: response.player.posterUrl,
          videoUrl: response.player.stream.vodUrl
        };
        console.log("in request", videoUrls);
        return videoUrls;
      })
      .catch(function (e) {
        winston.log('error',
            e.response.request.uri.href, //same as e.options.uri,
            e.name, e.statusCode, e.error.systemerror);
      });
    }
}
