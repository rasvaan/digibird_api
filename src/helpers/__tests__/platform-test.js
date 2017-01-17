var expect = require('chai').expect;
var platforms = require('../platforms');

describe('platforms', function() {
  it('get platforms', function() {
    const platformsArray = platforms.platforms();

    expect(platformsArray).to.be.an('array');

    for (let i=0; i<platformsArray.length; i++) {
      expect(platformsArray[i]).to.include.keys(
        ['name', 'id', 'prefix', 'name_space', 'endpoint_type', 'endpoint_location']
      );
    }
  });
  it('get platform', function() {
    expect(platforms.platform('accurator')).to.be.a('object');
    expect(function(){platforms.platform('annotator')}).to.throw(Error);
  });
  it('platform exists', function() {
    expect(platforms.exists('accurator')).to.equal(true);
    expect(platforms.exists('annotator')).to.equal(false);
  });
});
