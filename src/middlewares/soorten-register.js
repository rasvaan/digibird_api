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
      case 'metadata': {
        options = this.metadataOptions();

        return request(options).then((data) => {
          return _this.processMetadata(data);
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
      const uri = `http://www.nederlandsesoorten.nl/nsr/concept/${result.associatedTaxonReference}/${i}`
      let culturalObject = this.createCulturalObject(result, uri);

      let aggregation = new Aggregation(
        `${uri}/aggregation`,
        culturalObject,
        new WebResource(result.serviceAccessPoints.MEDIUM_QUALITY.accessUri, IMAGE)
      );

      if (result.copyrightText) aggregation.addLicense(result.copyrightText);
      aggregations.push(aggregation);
    }

    return aggregations;
  },
  createCulturalObject: function(result, uri) {
    // create a new object, minimum info is url
    let object = new CulturalObject(uri);

    // extend information object when possible
    if (result.creator) object.addCreator(result.creator);

    if (result.identifications &&
        result.identifications[0].vernacularNames &&
        result.identifications[0].vernacularNames[1] &&
        result.identifications[0].vernacularNames[1].name) {
      object.addTitle(result.identifications[0].vernacularNames[1].name);
    }

    if (result.gatheringEvents && result.gatheringEvents[0].dateTimeBegin) {
      const date = new Date(result.gatheringEvents[0].dateTimeBegin);
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      if (!isNaN(date)) object.addTemporal(dateString);
    }

    if (result.gatheringEvents && result.gatheringEvents[0].localityText) {
      object.addSpatial(result.gatheringEvents[0].localityText);
    }

    return object;
  },
  metadataOptions: function() {
    const url = platforms.platform("soortenregister").statistics_endpoint_location;

    return { "url":url };
  },
  processMetadata: function(data) {
    const metadata = JSON.parse(data);

    return [
      {
        "type": 'Species',
        "value": metadata.all_established
      },
      {
        "type": 'Species with image',
        "value": metadata.statistics.species_with_image.count
      },
      {
        "type": 'Images',
        "value": metadata.statistics.images.count
      },
      {
        "type": 'Contributors',
        "value": metadata.statistics.photographer.count
      }
    ];
  }
}
