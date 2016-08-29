/*******************************************************************************
DigiBird retreival of Natuurbeelden collection metadata

This is the server backend to connect to the BenG Elastic Search instance
containing the Natuurbeelden video collections.

The script can be run individually with the following command:
node ./src/middlewares/natuurbeelden.js

*******************************************************************************/
var http = require('http');
var request = require('request-promise-native');
var path = require('path');
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

      // return a promise with the video information
      return request(options)
      .then(function (response) {
        var video = {
          imageUrl: response.player.posterUrl,
          videoUrl: response.player.stream.vodUrl
        };

        return video;
      })
      // if an error occurs, the promise response is null
      .catch(function (e) {
        winston.log('error',
            e.response.request.uri.href, //same as e.options.uri,
            e.name, e.statusCode, e.error.systemerror);

        return null;
      });
    },

    getMetadataVideos: function() {
      var filePath = path.resolve(__dirname, '..', 'helpers/natuurbeelden_selection.json');
      var data = utils.readJsonFile(filePath);

      var totCount = Object.keys(data).length;
      console.log("Count:", totCount);

      // for every selected video
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // get the guci ID for the current video record
          var guciID = data[key].details.guci;
          // add a new property in the data object named video, that contains
          // information about the video (like imageURL and videoURL). Initially,
          // this property has value null
          data[key].video = null;

          // get video information for the current record from VideoDock
          this.getVideoUrls(guciID)
          .then(function(videoUrls) {
            if (videoUrls != null) {
                // add image and video URL for the video
                data[key].video.imageUrl = videoUrls.imageUrl;
                data[key].video.videoUrl = videoUrls.videoUrl;
            }
          });
        }
      }
    }
}
