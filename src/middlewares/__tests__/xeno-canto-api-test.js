// npm test, 
//https://mochajs.org/
//http://chaijs.com/
var expect = require('chai').expect;
var xenoCantoApi = require('../xeno-canto-api');

describe('xeno-canto-api', function() {
  describe('process aggregations', function() {
    it('should be true', function() {
      expect(xenoCantoApi.processAggregations()).to.be.empty;
    });
    it('async should be true', function() {
      return xenoCantoApi.testAsyncVal()
        .then(function(val) {
          expect(val).to.equal('bl0')
        })
    });
  });
});
