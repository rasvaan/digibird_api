/*******************************************************************************
DigiBird retreival of Waisda? instance data

This is the server backend to connect to the Waisda? instance
containing the Natuurbeelden video collection depicting birds.

The script can be run individually with the following command:
node ./src/middlewares/waisda.js

*******************************************************************************/
var http = require('http');
var request = require('request-promise-native');
var path = require('path');
var fs = require('fs');
var winston = require('winston');
var utils = require('../helpers/utils');

// var notFoundImage = path.resolve(__dirname, '..', 'helpers/BenG_testbeeld.jpg');
var notFoundImage = '/home/larahack/img/BenG_testbeeld.jpg';

var BenGUrl = 'http://api2.video.beeldengeluid.videodock.com/api/2.0/guci/';
// var waisdaDbUrl = 'http://waisda.beeldengeluid.nl/waisdadb';
var waisdaDbUrl = 'http://localhost:3010';

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
        var image = response.player.posterUrl;

        if (image) {
          video.imageUrl = image;
        } else { // no image provided, replace with custom one
          video.imageUrl = notFoundImage;
        }
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

    // adds all the necessary data that needs to be added in the Video table
    prepareInsertVideo : function(videoUrls) {
      var videoDBdata = {
        title: videoUrls.title,
        duration: videoUrls.duration,
        imageUrl: videoUrls.imageUrl,
        enabled: 1,
        playerType: 'JW',
        sourceUrl: videoUrls.videoUrl,
        fragmentID: 'NULL',
        sectionNid: 'NULL',
        startTime: videoUrls.duration
      };

      return videoDBdata;
    },

    // insert video information in Waisda? DB
    insertVideo: function(video) {
      var videoData = this.prepareInsertVideo(video);

      // configuration of POST request
      var options = {
        method: 'POST',
        uri: waisdaDbUrl + '/video', // URL to hit
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          video: videoData
        },
        json: true // json serialization on the body = stringifies body to JSON
      };

      // return a promise with the video information
      return request(options)
      .then(function (response) {
        // add the image and video Urls for the current video
        return response;
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
      var _this = this;

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
                  return _this.insertVideo(videoUrls);
                }
              })
            // if an error occurs, the promise response is null
            .catch(function (e) {
              winston.log('error',
                  e.response.request.uri.href, //same as e.options.uri,
                  e.name, e.statusCode, e.error.systemerror);

              return null;
            });
          }
        }
      }
    }
  },

  // get general statistics Waisda?
  getStatistics: function() {
    // configuration of GET request
    var options = {
      method: 'GET',
      uri: waisdaDbUrl + '/statistics', // URL to hit
      headers: {
        'Content-Type': 'application/json'
      },
      json: true // json serialization on the body = stringifies body to JSON
    };

    console.log(options);
    // return a promise with the statistics information
    return request(options)
    .then(function (response) {
      // GET statistics: #players, #tags, #videos, #games
      return response;
    })
    // if an error occurs, the promise response is null
    .catch(function (e) {
      winston.log('error',
          e.response.request.uri.href, //same as e.options.uri,
          e.name, e.statusCode, e.error.systemerror);

      return null;
    });
  }
}
