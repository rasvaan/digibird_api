/*******************************************************************************
DigiBird output helper file, serializes JSON-LD into a variety of RDF formats
*******************************************************************************/

module.exports = {
  replySerialization: function(format, jsonLd, res) {
    switch (format) {
      case 'json-ld': {
        res.json(jsonLd);
      }
      case 'nQuads': {
        return toNQuads(json);
      }
      default: {
        return new Promise(function(resolve, reject) {
          const error = new Error(`${format} serialization is not yet available`);
          reject(error);
        });
      }
    }
  },
  toNQuads: function(json) {
    console.log('converting the following to nquads:', json);
  }
}
