var expect = require('chai').expect;
var interpret = require('../request_interpretation');
var { InterpretError } = require('../../classes/Errors');

describe('request interpretation', function() {
  it.only('annotation parameters', function() {
    const query = { "platform": 'accurator', "since": '2017-01-18T11:55:01.010Z' };
    const emptyQuery = { };

    expect(interpret.annotationParameters(query)).to.be.an('object');
    expect(
      function(){interpret.annotationParameters(emptyQuery)}
    ).to.throw(InterpretError);
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
