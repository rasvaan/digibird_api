/*******************************************************************************
DigiBird output helper file, serializes JSON-LD into a variety of RDF formats
*******************************************************************************/
var jsonld = require('jsonld');
var jsonLdPromises = jsonld.promises;
var N3 = require('n3');

module.exports = {
  replySerialization: function(format, jsonLd, res) {
    switch (format) {
      case 'json-ld': {
        res.json(jsonLd);
      }
      case 'nQuads': {
        this.toNQuads(jsonLd).then(function(nQuads) {
          const fileName = 'objects';

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
          console.log('outputted turtle', turtle);
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

    return this.parseTriples(jsonLd).then(function(triples) {
      return _this.writeTurtle(triples);
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
  writeTurtle: function(triples) {
    //TODO: add correct prefixes from context
    let writer = N3.Writer({ "prefixes": { } });

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
