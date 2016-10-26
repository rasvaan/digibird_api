/*******************************************************************************
Waisda API middleware
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

    switch(parameters.request) {
      case 'species': {
        options = this.commonName(parameters);

        return request(options).then((data) => {
          return _this.processAggregations(data);
        });
      }
      case 'annotations': {
        options = this.annotationOptions(parameters);
        console.log('annotations options', options);
        return request(options).then((data) => {
          console.log('got data', data);
          // return _this.processAggregations(data);
        });
      }
      case 'annotations_since': {
        options = this.annotationSinceOptions(parameters);
        console.log('annotations since options', options);
        return request(options).then((data) => {
          console.log('got data', data);
          // return _this.processAggregations(data);
        });
      }
      case 'metadata': {
        options = this.metadataOptions();

        return request(options).then((data) => {
          return _this.processMetadata(data);
        });
      }
    }
  },
  metadataOptions: function() {
    const url = `${platforms.platform("waisda").endpoint_location}statistics/`;

    return { "url":url };
  },
  annotationOptions: function() {
    const url = `${platforms.platform("waisda").endpoint_location}video/tag`;
    const bodyData = { "limit": 40 };

    return { "url": url, "method": "POST", "body": bodyData, "json": true};
  },
  annotationSinceOptions: function(parameters) {
    //TODO: correct to original date
    let shortDate = parameters.date.toJSON().substring(0, 19);
    console.log('shortdate', shortDate);
    const url = `${platforms.platform("waisda").endpoint_location}video/tag`;
    const bodyData = { "date": shortDate };

    return { "url": url, "method": "POST", "body": bodyData, "json": true};
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
  },
  processAggregations: function(string) {
    const data = JSON.parse(string);
    const VIDEO = 'dctype:MovingImage';
    let aggregations = [];

    for (let i=0; i<data.length; i++) {
      const result = data[i];
      let culturalObject = this.createCulturalObject(result);
      let webResource = new WebResource(result.sourceUrl, VIDEO);

      // TODO: update url to metadataUrl
      let aggregation = new Aggregation(
        `${result.sourceUrl}/aggregation`,
        culturalObject,
        webResource
      );

      // TODO: get the actual license rights
      aggregation.addLicense("https://creativecommons.org/licenses/by/4.0/");
      aggregations.push(aggregation);
    }

    return aggregations;
  },
  // TODO: add original link to Natuurbeelden metadata
  createCulturalObject: function(result) {
    // create a new object, minimum info is url
    let object = new CulturalObject(result.sourceUrl);
    // extend information object when possible
    if (result.title) object.addTitle(result.title);
    if (result.imageUrl) object.addThumbnail(result.imageUrl);

    return object;
  },
  commonName: function(parameters) {
    let commonName = (parameters.common_name_nl || parameters.common_name).toLowerCase();
    const url = `${platforms.platform("waisda").endpoint_location}video/tag/${commonName}`;

    return { "url": url };
  },
}
