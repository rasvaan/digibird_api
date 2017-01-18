var expect = require('chai').expect;
var interpret = require('../request_interpretation');
var { InterpretError } = require('../../classes/Errors');

describe.only('request interpretation', function() {
  it('annotation parameters', function() {
    const query = { "platform": 'accurator', "since": '2017-01-18T11:55:01.010Z' };
    const emptyQuery = { };

    expect(interpret.annotationParameters(query)).to.be.an('object');
    expect(
      function(){interpret.annotationParameters(emptyQuery)}
    ).to.throw(InterpretError);
  });
  it('empty bird parameters', function() {
    const emptyQuery = { };

    expect(
      function(){interpret.birdParameters(emptyQuery)}
    ).to.throw(InterpretError);
  });
  it('common parameter', function() {
    const commonQuery = { "common_name": 'Rifleman' };

    return interpret.birdParameters(commonQuery).then(val => {
      expect(val).to.be.an('object');
    });
  });
  it('incorrect common parameter', function() {
    const incorrectCommonQuery = { "common_name": 'man' };

    return interpret.birdParameters(incorrectCommonQuery).then(
      () => {throw new Error('Expected an error.')},
      (error) => { expect(error).to.be.an.instanceof(InterpretError); }
    );
  });
  it('genus parameter', function() {
    const genusQuery = { "genus": 'Pica' };

    return interpret.birdParameters(genusQuery).then(val => {
      expect(val).to.be.an('object');
    });
  });
  it('incorrect genus parameter', function() {
    const incorrectGenusQuery = { "genus": 'Man' };

    return interpret.birdParameters(incorrectGenusQuery).then(
      () => {throw new Error('Expected an error.')},
      (error) => { expect(error).to.be.an.instanceof(InterpretError); }
    );
  });
  it('species parameter', function() {
    const speciesQuery = { "species": 'pica', "genus": 'Pica' };

    return interpret.birdParameters(speciesQuery).then(val => {
      expect(val).to.be.an('object');
    });
  });
  it('incorrect species parameter', function() {
    const unknownSpeciesQuery = { "species": 'man', "genus": 'Man' };

    return interpret.birdParameters(unknownSpeciesQuery).then(
      () => {throw new Error('Expected an error.')},
      (error) => { expect(error).to.be.an.instanceof(InterpretError); }
    );
  });
  it('parse date', function() {
    const dateString = "2017-01-18T11:55:01.010Z";
    const dateUndefined = undefined;
    const incorrectDateString = "aa17-01-18T11:55:01.010Z";

    expect(interpret.dateParser(dateString)).to.be.a('date');
    expect(interpret.dateParser(dateUndefined)).to.equal(null);
    expect(
      function(){interpret.dateParser(incorrectDateString)}
    ).to.throw(InterpretError);
  });
  it('platform parameter', function() {
    const emptyQuery = { };
    const query = { "platform": 'soortenregister' };
    const wrongQuery = { "platform": 'museum' };

    expect(
      function(){interpret.platformParameter(emptyQuery)}
    ).to.throw(InterpretError);

    expect(
      interpret.platformParameter(query)
    ).to.equal('soortenregister');

    expect(
      function(){interpret.platformParameter(wrongQuery)}
    ).to.throw(InterpretError);
  });
  it('platform array parameter', function() {
    const emptyQuery = { };
    const query = { "platform": 'soortenregister' };
    const multipleQuery = { "platform": ['rijksmuseum', 'accurator'] };
    const wrongQuery = { "platform": 'museum' };
    const multipleWrongQuery = { "platform": ['museum', 'accurator'] };

    expect(
      interpret.platformArrayParameter(emptyQuery)
    ).to.be.an('array');

    expect(
      interpret.platformArrayParameter(query)
    ).to.deep.equal(['soortenregister']);

    expect(
      interpret.platformArrayParameter(multipleQuery)
    ).to.deep.equal(['rijksmuseum', 'accurator']);

    expect(
      function(){interpret.platformArrayParameter(wrongQuery)}
    ).to.throw(InterpretError);

    expect(
      function(){interpret.platformArrayParameter(multipleWrongQuery)}
    ).to.throw(InterpretError);
  });
  // it('object parameters', function() {
  //   let query = { "platform": 'soortenregister', "common_name": 'Rifleman' }
  //
  //   return interpret.objectParameters(query).then(parameters => {
  //     console.log(parameters);
  //     return true;
  //   });
  // });
  // it('incorrect object request', function() {
  //   let query = { "platform": 'soortenregister', "common_name": 'Phoenix' }
  //
  //   return interpret.objectParameters(query).then(parameters => {
  //     console.log(parameters);
  //     return true;
  //   });
  // });
  // it('common name parameters', function() {
  //   return true;
  // });
  // it('genus parameters', function() {
  //   return true;
  // });
  // it('species parameters', function() {
  //   return true;
  // });
  // it('incorrect parameters', function() {
  //   return true;
  // });
});
