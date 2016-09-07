/*******************************************************************************
Soortenregister API middleware
*******************************************************************************/
var platforms = require('../helpers/platforms');
var request = require('request-promise-native');
var winston = require('winston');

module.exports = {
  request: function(parameters) {
    let options;

    switch(parameters.request) {
      case 'genus': {
        options = this.genus(parameters);

        return request(options).then((json) =>
          JSON.parse(json)
        );
      }
      case 'species': {
        options = this.species(parameters);

        return request(options).then((json) =>
          JSON.parse(json)
        );
      }
    }
  },
  genus: function(parameters) {
    const platform = platforms.platform('soortenregister');
    const query = { "genus": parameters.genus };
    const url = `${platform.endpoint_location}/taxon/search/`;

    return { "url":url, "qs": query };
  },
  species: function(parameters) {
    const platform = platforms.platform("soortenregister");
    const query = { "genus": parameters.genus, "species": parameters.species };
    const url = `${platform.endpoint_location}/taxon/search/`;

    return { "url":url, "qs": query };
  }
}
