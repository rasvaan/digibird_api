/*******************************************************************************
DigiBird annotation information component
*******************************************************************************/
var platformMetadata = require('./platforms');
var request = require('request-promise-native');
var interpret = require('../helpers/request_interpretation');
var soortenRegister = require('../middlewares/soorten-register');
var xenoCanto = require('../middlewares/xeno-canto-api');
var tripleStore = require('../middlewares/triple-store');
var Results = require('../classes/Results');
var Aggregation = require('../classes/Aggregation');
var CulturalObject = require('../classes/CulturalObject');
var WebResource = require('../classes/WebResource');

module.exports = {
  get: function(parameters) {
    console.log('annotations get');
    switch(parameters.platform.endpoint_type) {
      case 'json-api': {
        return this.annotationsApi(parameters);
      }
      case 'sparql': {
        return this.annotationsTripleStore(parameters);
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(
            `${parameters.platform.endpoint_type} for ${parameters.platform.id} is not yet available`
          );
          reject(error);
        });
      }
    }
  },
  since: function(parameters) {
    console.log('annotations since');
    switch(parameters.platform.endpoint_type) {
      case 'json-api': {
        return this.annotationsSinceApi(parameters);
      }
      case 'sparql': {
        return this.annotationsSinceTripleStore(parameters);
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(
            `${parameters.platform.endpoint_type} for ${parameters.platform.id} is not yet available`
          );
          reject(error);
        });
      }
    }
  },
  annotationsApi: function(parameters) {
    console.log('annotations api, ', parameters.platform.id);
    switch (parameters.platform.id) {
      // case 'waisda': {
      //   return waisda.request(parameters).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsTripleStore: function(parameters) {
    let _this = this;
    console.log('annotations triple store, ', parameters.platform.id);
    switch(parameters.platform.id) {
      // case 'accurator': {
      //   return tripleStore.query(platform, query.query).then((values) => {
      //     return _this.processSparqlAggregations(values, 'dctype:Image');
      //   }).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsSinceApi: function(parameters) {
    console.log('annotations since api, ', parameters.platform.id);
    switch (parameters.platform.id) {
      // case 'waisda': {
      //   return waisda.request(parameters).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  },
  annotationsSinceTripleStore: function(parameters) {
    let _this = this;
    console.log('annotations since triple store, ', parameters.platform.id);
    switch(parameters.platform.id) {
      // case 'accurator': {
      //   return tripleStore.query(platform, query.query).then((values) => {
      //     return _this.processSparqlAggregations(values, 'dctype:Image');
      //   }).then((aggregations) => {
      //     return new Results(aggregations, [platform]);
      //   });
      // }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`Annotations from ${parameters.platform.id} are not yet available`);
          reject(error);
        });
      }
    }
  }
}
