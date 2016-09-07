/*******************************************************************************
Xeno-canto API middleware
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
        break;
      }
      case 'species': {
        options = this.species(parameters);
        break;
      }
    }

    return request(options)
    .then((json) => JSON.parse(json));
  },
  genus: function(parameters) {
    const platform = platforms.platform('xeno-canto');
    const query = { "query": `gen:${parameters.genus}` };
    const url = platform.endpoint_location;

    return { "url":url, "qs": query };
  },
  species: function(parameters) {
    const platform = platforms.platform("xeno-canto");
    const query = { "query": `${parameters.genus} ${parameters.species}`};
    const url = platform.endpoint_location;

    return { "url":url, "qs": query };
  }
}
