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
        // search for metadata related to the query
        return request(bengOptions).then((data) => {
          let searchResults = data.responseItems;
          let promises = [];

          for (let i=0; i<searchResults.length; i++) {
            let collectedData = this.processSearchResult(searchResults[i]);

            if (searchResults[i].expressie && searchResults[i].expressie.id) {
              //retrieve aditional metadata
              let metadataOptions = this.metadataOptions(searchResults[i].expressie.id);

              let promise = request(metadataOptions).then(stringMetadata => {
                let metadata = JSON.parse(stringMetadata);

                if (metadata.details && metadata.details.guci) {
                  collectedData = this.processMetadata(metadata, collectedData);
                  // retrieve video metadata
                  let videoOptions = this.videoOptions(metadata.details.guci);

                  return request(videoOptions).then(stringVideo => {
                    let videoData = JSON.parse(stringVideo);
                    collectedData = this.processVideoData(videoData, collectedData);

                    return collectedData;
                  });
                } else {
                  // could not retrieve video metadata
                  return null;
                }
              });

              promises.push(promise);
            }
          }

          return Promise.all(promises).then(results => {
            // filter null values
            results = results.filter(result => result != undefined);
            let aggregations = _this.processAggregations(results);

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
  processSearchResult: function(result) {
    let collectedData = {};

    if (result.expressie && result.expressie.id) {
      collectedData.uri = this.constructUri(result.expressie.id);
    }

    if (result.mainTitle) {
      collectedData.title = result.mainTitle;
    }

    if (result.publicaties[0] && result.publicaties[0].tijdsduur) {
      collectedData.duration = result.publicaties[0].tijdsduur;
    } else {
      collectedData.duration = 0;
    }

    return collectedData;
  },
  processMetadata: function(metadata, collectedData) {
    if (metadata.details.selecties && metadata.details.selecties[0]) {
      if (metadata.details.selecties[0].selectie &&
          metadata.details.selecties[0].selectie.titel) {
          collectedData.title = metadata.details.selecties[0].selectie.titel;
      }
      if (metadata.details.selecties[0].tijdsduur) {
        collectedData.duration = metadata.details.selecties[0].tijdsduur;
      }
    }

    if (metadata.details.expressie &&
        metadata.details.expressie.beschrijving) {
      collectedData.description = metadata.details.expressie.beschrijving;
    } else {
      collectedData.description = '';
    }

    return collectedData;
  },
  processVideoData: function(videoData, collectedData) {
    if (videoData.player) {
      if (videoData.player.stream &&
          videoData.player.stream.vodUrl) {
        let drefVideoUrl = videoData.player.stream.vodUrl;
        collectedData.videoUrl = drefVideoUrl.replace(/.dref/gi, "");
      }

      if (videoData.player.posterUrl) {
        collectedData.imageUrl = videoData.player.posterUrl;
      }
    }

    return collectedData;
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
    return `${platforms.platform("natuurbeelden").name_space}collectie/details/expressie/${expressieId}/false/`;
  },
}
