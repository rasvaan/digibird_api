var expect = require('chai').expect;
var blogMiddleware = require('../blog');
var credentials = require('../wordpress_credentials');

describe('blog', function() {
  it('get credentials', function() {
    expect(credentials.USERNAME).to.be.a('string');
    expect(credentials.PASSWORD).to.be.a('string');
  });
  it('get wordpress posts', function() {
    return blogMiddleware.getWordpressPosts().then(val => {
      expect(val).to.be.a('array');
    });
  });
  it('filter digibird posts', function() {
    const posts = [
      {
        "terms": [{ "taxonomy":'post_tag', "name":'digibird' }]
      },
      {
        "terms": [{ "taxonomy":'post_tag', "name":'other' }]
      },
      { }
    ];
    expect(blogMiddleware.filterDigibirdPosts([])).to.have.lengthOf(0);
    expect(blogMiddleware.filterDigibirdPosts(posts)).to.have.lengthOf(1);
  });
  it('filter text', function() {
    const posts = [
      { "content": 'a [...] b' },
      { "content": '\n[gallery ids="694,693" type="rectangular"]\r' },
      { "content": 'a b' },
      { }
    ];
    const cleanPosts = [
      { "content": 'a  b' },
      { "content": '\n\r' },
      { "content": 'a b' },
      { }
    ];
    const filteredPosts = blogMiddleware.filterTextPosts(posts);

    expect(filteredPosts).to.have.deep.equal(cleanPosts);
  });
});
