var expect = require('chai').expect;
var statistics = require('../statistics');
var platforms = require('../platforms');

describe('statistics', function() {
  it('get statistics accurator triple store', function() {
    return statistics.get('accurator').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get statistics rijksmuseum triple store', function() {
    return statistics.get('rijksmuseum').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get statistics soortenregister api', function() {
    return statistics.get('soortenregister').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get statistics xeno-canto api', function() {
    return statistics.get('xeno-canto').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get statistics natuurbeelden api', function() {
    return statistics.get('natuurbeelden').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get statistics waisda api', function() {
    return statistics.get('waisda').then(statistics => {
      // check if all results have a type and value
      for (let i=0; i<statistics.length; i++)
        expect(statistics[i]).to.include.keys(['type', 'value']);
    });
  });
  it('get number users accurator triple store', function() {
    const platform = platforms.platform('accurator');

    return statistics.statisticsTripleStore(platform, 'users').then(val => {
      expect(val).to.include.keys(['type', 'value']);
    });
  });
  it('get number objects rijksmuseum triple store', function() {
    const platform = platforms.platform('rijksmuseum');

    return statistics.statisticsTripleStore(platform, 'objects').then(val => {
      expect(val).to.include.keys(['type', 'value']);
    });
  });
  it('triple store not found', function() {
    const platform = {
      "name": "Museum",
      "endpoint_location": "http://museum.eculture.labs.vu.nl/sparql/"
    };

    return statistics.statisticsTripleStore(platform, 'objects')
    .then(
      () => {throw new Error('Expected an error. Endpoint does not exist')},
      () => { } // error is handled
    );
  });
  it('get statistics queries', function() {
    const queries = statistics.sparqlStatisticsQueries();
    const keys = Object.keys(queries);

    expect(queries).to.be.an('object');
    expect(queries['test'].query).to.be.a('string');

    // check if all queries have a query and name
    for (let i=0; i<keys.length; i++)
      expect(queries[keys[i]]).to.include.keys(['query', 'name']);
  });
});
