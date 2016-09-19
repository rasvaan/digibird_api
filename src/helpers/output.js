/*******************************************************************************
DigiBird output helper file, serializes JSON-LD into a variety of RDF formats
*******************************************************************************/
var jsonld = require('jsonld');
var jsonLdPromises = jsonld.promises;
var N3 = require('n3');

module.exports = {
  replySerialization: function(format, jsonLd, res) {
    const fileName = 'objects';

    switch (format) {
      case 'json-ld': {
        res.json(jsonLd);
      }
      case 'nQuads': {
        this.toNQuads(jsonLd).then(function(nQuads) {
          // set nquads mime-type
          res.set({
            "Content-Type": 'application/n-quads',
            "Content-Disposition": `filename=${fileName}.nq`
          });
          res.send(nQuads);
        });
      }
      case 'turtle': {
        this.toTurtle(jsonLd).then(function(turtle) {
          // set turtle mime-type
          res.set({
            "Content-Type": 'text/turtle',
            "Content-Disposition": `filename=${fileName}.ttl`
          });
          res.send(turtle);
        });
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`${format} serialization is not yet available`);
          reject(error);
        });
      }
    }
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
