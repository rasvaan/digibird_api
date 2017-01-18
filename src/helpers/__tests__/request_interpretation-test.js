var expect = require('chai').expect;
var interpret = require('../request_interpretation');
var { InterpretError } = require('../../classes/Errors');

describe.only('request interpretation', function() {
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
