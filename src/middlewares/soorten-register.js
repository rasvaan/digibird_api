/*******************************************************************************
Soortenregister API middleware
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
  processAggregations: function(string) {
    const data = JSON.parse(string);
    const IMAGE = 'dctype:Image';
    let aggregations = [];

    for (let i=0; i<data.searchResults.length; i++) {
      const result = data.searchResults[i].result;

      aggregations[aggregations.length] = new Aggregation(
        `http://www.nederlandsesoorten.nl/${result.sourceSystemId}/aggregation`,
        new CulturalObject(`http://www.nederlandsesoorten.nl/${result.sourceSystemId}`),
        new WebResource(result.serviceAccessPoints.MEDIUM_QUALITY.accessUri, IMAGE)
      );
    }

    return aggregations;
  }
}
