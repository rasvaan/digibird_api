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
    const SOUND = 'dctype:Sound';
    let aggregations = [];

    for (let i=0; i<data.recordings.length; i++) {
      const result = data.recordings[i];
      let culturalObject = this.createCulturalObject(result);
      let webResource = new WebResource(result.file, SOUND);
      let aggregation = new Aggregation(
        `${result.url}/aggregation`,
        culturalObject,
        webResource
      );

      aggregation.addLicense(result.lic);
      aggregations[aggregations.length] = aggregation;
    }

    return aggregations;
  },
  createCulturalObject: function(result) {
    // create a new object, minimum info is url
    let object = new CulturalObject(result.url);
    // extend information object when possible
    if (result.rec) object.addCreator(result.rec);
    if (result.type) object.addType(result.type);
    if (result.loc) object.addSpatial(result.loc);
    if (result.date) object.addTemporal(result.date);

    return object;
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
