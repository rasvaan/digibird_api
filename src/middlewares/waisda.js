/*******************************************************************************
Xeno-canto API middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');
var Aggregation = require('../classes/Aggregation');
var CulturalObject = require('../classes/CulturalObject');
var WebResource = require('../classes/WebResource');

module.exports = {
  request: function(parameters) {
    let options;
    let _this = this;
    console.log("in waisda - request:", parameters);

    switch(parameters.request) {
      case 'metadata': {
        options = this.metadataOptions();
        console.log("options:", options);

        return request(options).then((data) => {
          console.log("data:", data);
          return _this.processMetadata(data);
        });
      }
    }
  },
  metadataOptions: function() {
    const url = `${platforms.platform("waisda").endpoint_location}/statistics/`;

    return { "url":url };
  },
  processMetadata: function(data) {
    const metadata = JSON.parse(data);

    return [{
      "type": 'Number of players',
      "value": metadata.noPlayers
    },
    {
      "type": 'Number of tags',
      "value": metadata.noTags
    },
    {
      "type": 'Number of videos',
      "value": metadata.noVideos
    },
    {
      "type": 'Number of games',
      "value": metadata.noGames
    }];
  }
}
