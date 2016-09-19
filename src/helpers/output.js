/*******************************************************************************
DigiBird output helper file, serializes JSON-LD into a variety of RDF formats
*******************************************************************************/
var jsonld = require('jsonld');
var jsonLdPromises = jsonld.promises;
var N3 = require('n3');

module.exports = {
  contentNegotiation: function(res, jsonLd) {
    const fileName = 'objects';
    let _this = this;

    res.format({
      'application/ld+json': function() {
        res.json(jsonLd);
      },
      'text/turtle': function() {
        _this.toTurtle(jsonLd).then(function(turtle) {
          res.send(turtle);
        });
      },
      'application/n-quads': function(){
        _this.toNQuads(jsonLd).then(function(nQuads) {
          // specify filename
          res.set({"Content-Disposition": `filename=${fileName}.nq`});
          res.send(nQuads);
        });
      },
      'default': function() {
        // log the request and respond with 406
        res.status(406).send('Not acceptable');
      }
    });
  },
  toNQuads: function(jsonLd) {
    // create the promise of a nquads string
    return jsonLdPromises.toRDF(jsonLd, {format: 'application/nquads'});
  },
  toTurtle: function(jsonLd) {
    let _this = this;
    let prefixes;

    return this.parseTriples(jsonLd).then(function(triples) {
      // extract prefixes from context
      prefixes = _this.extractPrefixes(jsonLd['@context']);
      // write the nquads
      return _this.writeTurtle(triples, prefixes);
    });
  },
  parseTriples(jsonLd) {
    // first convert to nquads and then return the promise of parsed triples
    return this.toNQuads(jsonLd).then(function(nQuads) {
      // create n-quads parser
      const parser = N3.Parser({ "format": 'application/n-quads' });
      let triples = [];

      let promise = new Promise(function(resolve, reject) {
        parser.parse(nQuads, function(error, triple, prefixes) {
          triple ? triples[triples.length] = triple : resolve(triples);
        });
      });

      return promise;
    });
  },
  extractPrefixes: function(context) {
    let prefixes = {};

    // iterate through keys and check whether the value is a string
    for (let key in context) {
      if (typeof context[key] === 'string') prefixes[key] = context[key];
    }

    return { "prefixes": prefixes };
  },
  writeTurtle: function(triples, prefixes) {
    let writer = N3.Writer(prefixes);

    for (let i=0; i<triples.length; i++) {
      writer.addTriple(triples[i]);
    }

    let promise = new Promise(function(resolve, reject) {
      writer.end(function (error, result) {
        error ? reject(error) : resolve(result);
      });
    });

    return promise;
  }
}
