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
    // retrieve the image and video Urls from VideoDock
    getVideoUrls: function(video) {

      // configuration of GET request
      var options = {
        method: 'GET',
        uri: URL + video.guciID, // URL to hit
        headers: {
          'Content-Type': 'application/json'
        },
        json: true // json serialization on the body = stringifies body to JSON
      };

      // return a promise with the video information
      return request(options)
      .then(function (response) {
        // add the image and video Urls for the current video
        video.imageUrl = response.player.posterUrl;
        video.videoUrl = response.player.stream.vodUrl;

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

      // var totCount = Object.keys(data).length;
      // console.log("Count:", totCount);

      // for every selected video
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // get the guci ID for the current video record
          var video = {
            guciID: data[key].details.guci
          };
          // get the selecties object, where title and duration are
          var selecties = data[key].details.selecties;

          // retrieve the title and the duration of the video
          for (var k in selecties) {
            if (data.hasOwnProperty(k)) {
              video.title = selecties[k].selectie.titel;
              video.duration = selecties[k].tijdsduur;

              // get video information for the current video from VideoDock
              this.getVideoUrls(video)
              .then(function(videoUrls) {
                if (videoUrls != null) {
                  // here make API call to the Waisda MySQL API and insert every video
                  console.log(videoUrls);
                }
              });
            }
          }
        }
      }
    }
}
