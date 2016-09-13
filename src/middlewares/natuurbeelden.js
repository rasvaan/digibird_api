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
var fs = require('fs');
var winston = require('winston');
var utils = require('../helpers/utils');
var natuurbeeldenUtils = require('../helpers/natuurbeelden');

var BenGUrl = 'http://api2.video.beeldengeluid.videodock.com/api/2.0/guci/';
// var waisdaDbUrl = 'http://waisda.beeldengeluid.nl/waisdadb';

module.exports = {
    // retrieve the image and video Urls from VideoDock
    getVideoUrls: function(video) {

      // configuration of GET request
      var options = {
        method: 'GET',
        uri: BenGUrl + video.guciId, // URL to hit
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

    // retrieve the image and video Urls from VideoDock
    insertVideoUrls: function(video) {

      // configuration of GET request
      var options = {
        method: 'POST',
        uri: waisdaDbUrl, // URL to hit
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          //get content from file
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

      var waisdaFile = path.resolve(__dirname, '..', 'helpers/waisda_BenG_selection.json');
      // var totCount = Object.keys(data).length;
      // console.log("Count:", totCount);

      // for every selected video
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          // get the guci ID for the current video record
          var video = {
            guciId: data[key].details.guci
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
                  // here make API calls to the Waisda MySQL API and insert every video
                  // the info is sent through a post request
                  // insertVideoUrls(videoUrls);
                  console.log(videoUrls);

                  //var videoObj = videoUrls;
                  var videoJSON = JSON.stringify(videoUrls, null, 2) + '\n';
                  // Node.js automatically restarts the app when one of the
                  // project files is changed / modified
                  // fs.appendFile(waisdaFile, JSON.stringify(JSON.parse(videoUrls), null, 2), encoding = 'utf-8',
                  // when it appends the file it starts the script again...
                  fs.appendFileSync(waisdaFile, videoJSON, encoding = 'utf-8',
                    function(err){
                    if(err)
                      console.error(err);
                    console.log('Appended!');
                  });
                }
              });
            }
          }
        }
      }
    }
}
