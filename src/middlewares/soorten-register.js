/*******************************************************************************
Soortenregister API middleware
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
    }
  },
  genus: function(parameters) {
    const platform = platforms.platform('soortenregister');
    const url = `${platform.endpoint_location}/multimedia/search/`;
    const query = {
      "genus": parameters.genus,
      "sourceSystem": 'Naturalis - Nederlands Soortenregister'
    };

    return { "url":url, "qs": query };
  },
  species: function(parameters) {
    const platform = platforms.platform("soortenregister");
    const url = `${platform.endpoint_location}/multimedia/search/`;
    const query = {
      "genus": parameters.genus,
      "species": parameters.species,
      "sourceSystem": 'Naturalis - Nederlands Soortenregister'
    };

    return { "url":url, "qs": query };
  },
  processObjects: function(string) {
    const data = JSON.parse(string);
    let images = [];

    for (let i=0; i<data.searchResults.length; i++) {
      images[images.length] = data.searchResults[i].result.serviceAccessPoints.MEDIUM_QUALITY.accessUri;
    }

    return images;
  }
}
