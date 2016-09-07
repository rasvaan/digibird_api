/*******************************************************************************
Xeno-canto API middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');

module.exports = {
  request: function(parameters) {
    let options;
    let _this = this;

    switch(parameters.request) {
      case 'genus': {
        options = this.genus(parameters);

        return request(options).then((data) => {
          return _this.processObjects(data);
        });
      }
      case 'species': {
        options = this.species(parameters);

        return request(options).then((data) => {
          return _this.processObjects(data);
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
  processObjects: function(string) {
    const data = JSON.parse(string);
    let sounds = [];

    for (let i=0; i<data.recordings.length; i++) {
      sounds[sounds.length] = data.recordings[i].file;
    }

    return sounds;
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
