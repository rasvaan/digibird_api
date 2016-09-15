/*******************************************************************************
DigiBird CulturalObject class
Metadata about a pretty cultural heritage object
*******************************************************************************/
class CulturalObject {
  constructor(uri) {
    this.uri = uri;
    this.type = 'edm:ProvidedCHO';
  }
  toJSONLD() {
    const jsonLd =
    {
      "@id": this.uri,
      "@type": this.type
    }

    return jsonLd;
  }
}

module.exports = CulturalObject;
