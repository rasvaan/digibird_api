/*******************************************************************************
DigiBird CulturalObject class
Metadata about a pretty cultural heritage object
*******************************************************************************/
class CulturalObject {
  constructor(uri) {
    this.uri = uri;
    this.type = 'edm:ProvidedCHO';
    this.contextProperties = [];
  }
  addCreator(creator) {
    this.creator = creator;
  }
  addType(objectType) {
    this.objectType = objectType;
  }
  addSpatial(spatial) {
    this.spatial = spatial;
  }
  addTemporal(temporal) {
    this.temporal = temporal;
  }
  toJSONLD() {
    const ld =
    {
      "@id": this.uri,
      "@type": this.type,
    }

    // stuff we might add
    if (this.creator) ld["dc:creator"] = this.creator;
    if (this.type) ld["dc:type"] = this.objectType;
    if (this.spatial) ld["dcterms:spatial"] = this.spatial;
    if (this.temporal) ld["dcterns:temporal"] = this.temporal;

    return ld;
  }
}

module.exports = CulturalObject;
