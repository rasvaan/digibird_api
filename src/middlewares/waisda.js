/*******************************************************************************
Waisda API middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');
var Results = require('../classes/Results');
var Aggregation = require('../classes/Aggregation');
var CulturalObject = require('../classes/CulturalObject');
var WebResource = require('../classes/WebResource');
var Annotation = require('../classes/Annotation');

module.exports = {
  request: function(parameters) {
    let options;
    let _this = this;

    switch(parameters.request) {
      case 'species': {
        options = this.commonName(parameters);

        return request(options).then((data) => {
          const values = JSON.parse(data);
          return _this.processAggregations(values);
        });
      }
      case 'annotations': {
        options = this.annotationOptions(parameters);

        return request(options).then((data) => {
          return new Results(_this.processAnnotatedAggregations(data));
        });
      }
      case 'annotations_since': {
        options = this.annotationSinceOptions(parameters);

        return request(options).then((data) => {
          return new Results(_this.processAnnotatedAggregations(data));
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
    const body = { "limit": 50 };

    return { "url": url, "method": "POST", "body": body, "json": true };
  },
  annotationSinceOptions: function(parameters) {
    //TODO: correct to original date
    let shortDate = parameters.date.toJSON().substring(0, 19);
    console.log('shortdate', shortDate);
    const url = `${platforms.platform("waisda").endpoint_location}video/tag`;
    const body = { "date": shortDate };

    return { "url": url, "method": "POST", "body": body, "json": true };
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
  processAggregations: function(data) {
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
  processAnnotatedAggregations: function(data) {
    const VIDEO = 'dctype:MovingImage';
    let aggregations = [];
    let annotations = [];

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

      // process annotations and add to list
      annotations.concat(
        this.processAnnotations(result.sourceUrl, result.tags)
      );

      // TODO: get the actual license rights
      aggregation.addLicense("https://creativecommons.org/licenses/by/4.0/");
      aggregations.push(aggregation);
    }

    return aggregations.concat(annotations);
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
  processAnnotations: function(target, tags) {
    /* extract annotations from sparql objects
    */
    let annotations = [];

    for (let i=0; i<tags.length; i++) {
      const tag = tags[i];
      const date = new Date(tag.creationDate);
      // TODO: garuantee that the uri is unique (e.g. add user)
      // this is currently not garanteed, because the uri is based on time and
      // tag, while we ask users to tag stuff at the same time...
      const tagUri = encodeURI(`${target}/${date.valueOf()}/${tag.tag}`);

      // create a new annotation
      let annotation = new Annotation(
        tagUri,
        target,
        tag.tag
      );

      if (!isNaN(date)) annotation.addDate(date.toJSON());
      annotations.push(annotation);
    }

    return annotations;
  },
  commonName: function(parameters) {
    let commonName = (parameters.common_name_nl || parameters.common_name).toLowerCase();
    const url = `${platforms.platform("waisda").endpoint_location}video/tag/${commonName}`;

    return { "url": url };
  },
}
