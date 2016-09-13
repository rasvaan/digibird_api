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

    switch(parameters.request) {
      case 'genus': {
        options = this.genus(parameters);

        return request(options).then((data) => {
          return _this.processAggregations(data);
        });
      }
      case 'species': {
        options = this.species(parameters);

        return request(options).then((data) => {
          return _this.processAggregations(data);
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
  genus: function(parameters) {
    const url = platforms.platform('xeno-canto').endpoint_location;
    const query = { "query": `gen:${parameters.genus}` };

    return { "url":url, "qs": query };
  },
  species: function(parameters) {
    const url = platforms.platform("xeno-canto").endpoint_location;
    const query = { "query": `${parameters.genus} ${parameters.species}`};

    return { "url":url, "qs": query };
  },
  processAggregations: function(string) {
    const data = JSON.parse(string);
    const SOUND = 'http://purl.org/dc/dcmitype/Sound';
    let aggregations = [];

    for (let i=0; i<data.recordings.length; i++) {
      const result = data.recordings[i];

      aggregations[aggregations.length] = new Aggregation(
        `${result.url}/aggregation`,
        new CulturalObject(result.url),
        new WebResource(result.file, SOUND)
      );
    }

    return aggregations;
  },
  metadataOptions: function() {
    const url = platforms.platform("xeno-canto").endpoint_location;

    return { "url":url, "qs": { "query": 'cnt:netherlands' } };
  },
  processMetadata: function(data) {
    const metadata = JSON.parse(data);

    return [{
      "type": 'Dutch contributions',
      "value": metadata.numRecordings
    }];
  }
}
