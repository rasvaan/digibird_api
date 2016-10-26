/*******************************************************************************
Natuurbeelden API middleware
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
        bengOptions = this.commonName(parameters);

        return request(bengOptions).then((data) => {
          let bengResults = data.responseItems;
          let promises = [];

          for (let i=0; i<bengResults.length; i++) {
            let collectedData = {};
            collectedData["uri"] = this.constructUri(bengResults[i].expressie.id).uri;
            collectedData["title"] = bengResults[i].mainTitle;
            if (bengResults[i].publicaties[0])
              collectedData["duration"] = bengResults[i].publicaties[0].tijdsduur;
            else collectedData["duration"] = 0;

            let metadataOptions = this.metadataOptions(bengResults[i].expressie.id);
            let promise = request(metadataOptions).then((stringMetadata) => {
              let metadata = JSON.parse(stringMetadata);
              let videoOptions = this.videoOptions(metadata.details.guci);

              if (metadata.details.selecties[0]) {
                collectedData["title"] = metadata.details.selecties[0].selectie.titel;
                collectedData["duration"] = metadata.details.selecties[0].tijdsduur;
              }
              if (metadata.details.expressie.beschrijving)
                collectedData["description"] = metadata.details.expressie.beschrijving;
              else collectedData["description"] = '';

              return request(videoOptions).then((stringVideo) => {
                let videoData = JSON.parse(stringVideo);
                let drefVideoUrl = videoData.player.stream.vodUrl;
                collectedData["imageUrl"] = videoData.player.posterUrl;
                collectedData["videoUrl"] = drefVideoUrl.replace(/.dref/gi, "");
                return collectedData;
              });
            });

            promises.push(promise);
          }
          return Promise.all(promises).then((results) => {
            return _this.processAggregations(results);
          });
        });
      }
      case 'metadata': {
        options = this.statisticsOptions();
        return request(options).then((data) => {
          return _this.processStatistics(data);
        });
      }
    }
  },
  statisticsOptions: function() {
    const url = `${platforms.platform("natuurbeelden").endpoint_location}terms/`;
    const bodyData = {
      "phrase": "",
      "page":"1",
      "numkeyframes":5,
      "sorting":"SORT-DEF",
      "mediaType":"ALL_MEDIA",
      "pagesize":20,
      "startdate":null,
      "enddate":null,
      "publiclyViewableResultsOnly":"true",
      "digitalViewableResultsOnly":null,
      "termFilters":{}
    };

    var options = {
      url: url, // URL to hit
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyData,
      json: true // json serialization on the body = stringifies body to JSON
    };
    return options;
  },
  processStatistics: function(data) {
    let totCount = 0, nbCount = 0;
    for (let i = 0; i < data.terms.length; i++) {
      if (data.terms[i].name.toLowerCase() === 'titels') {
        totCount = data.terms[i].total;
        for (let j = 0; j < data.terms[i].counts.length; j++)
          if (data.terms[i].counts[j].term.toLowerCase() === 'natuurbeelden') {
            nbCount = data.terms[i].counts[j].count;
            break;
          }
      break;
      }
    }

    return [{
      "type": 'Total number of videos',
      "value": (totCount == 0 ? "not available" : totCount)
    },
    {
      "type": 'Number of Natuurbeelden videos',
      "value": (nbCount == 0 ? "not available" : nbCount)
    }];
  },
  constructUri: function(expressieId) {
    const uri = `${platforms.platform("natuurbeelden").name_space}collectie/details/expressie/${expressieId}/false/`;

    return { "uri":uri };
  },
  metadataOptions: function(expressieId) {
    const url = `${platforms.platform("natuurbeelden").endpoint_location}docs/${expressieId}`;

    return { "url":url };
  },
  videoOptions: function(guciId) {
    const url = `${platforms.platform("natuurbeelden").video_endpoint_location}guci/${guciId}`;

    return { "url":url };
  },
  processAggregations: function(results) {
    const VIDEO = 'dctype:MovingImage';
    let aggregations = [];

    for (let i=0; i<results.length; i++) {
      const result = results[i];
      let culturalObject = this.createCulturalObject(result);
      let webResource = new WebResource(result.videoUrl, VIDEO);

      let aggregation = new Aggregation(
        `${result.uri}aggregation`,
        culturalObject,
        webResource
      );

      // TODO: get the actual license rights
      aggregation.addLicense("https://creativecommons.org/licenses/by/4.0/");
      aggregations.push(aggregation);
    }
    return aggregations;
  },
  createCulturalObject: function(result) {
    // create a new object, minimum info is url
    let object = new CulturalObject(result.uri);
    // extend information object when possible
    if (result.title) object.addTitle(result.title);
    if (result.description) object.addDescription(result.description);
    if (result.imageUrl) object.addThumbnail(result.imageUrl);
    if (result.duration) object.addDuration(result.duration);

    return object;
  },
  commonName: function(parameters) {
    let commonName = (parameters.common_name_nl || parameters.common_name).toLowerCase();
    const url = `${platforms.platform("natuurbeelden").endpoint_location}search`;
    const bodyData = {
      "phrase":`${commonName}`,
      "page":"1",
      "numkeyframes":5,
      "sorting":"SORT-DEF",
      "mediaType":"ALL_MEDIA",
      "pagesize":12,
      "startdate":null,
      "enddate":null,
      "publiclyViewableResultsOnly":"true",
      "digitalViewableResultsOnly":"false",
      "termFilters":{}
    };

    var options = {
      url: url, // URL to hit
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bodyData,
      json: true // json serialization on the body = stringifies body to JSON
    };
    return options;
  },
}
