/*******************************************************************************
DigiBird output helper file, serializes JSON-LD into a variety of RDF formats
*******************************************************************************/
var jsonld = require('jsonld');
var jsonLdPromises = jsonld.promises;

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
  }
}
