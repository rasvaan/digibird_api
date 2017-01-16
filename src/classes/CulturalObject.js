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
  addTitle(title) {
    this.title = title;
  }
  addType(objectType) {
    this.objectType = objectType;
  }
  addDescription(description) {
    this.description = description;
  }
  addSpatial(spatial) {
    this.spatial = spatial;
  }
  addTemporal(temporal) {
    this.temporal = temporal;
  }
  addThumbnail(thumbnail) {
    this.thumbnail = thumbnail;
  }
  addDuration(duration) {
    this.duration = duration;
  }
  toJSONLD() {
    const ld =
    {
      "@id": this.uri,
      "@type": this.type,
    }

    // stuff we might add
    if (this.creator) ld["dc:creator"] = this.creator;
    if (this.title) ld["dc:title"] = this.title;
    if (this.type) ld["dc:type"] = this.objectType;
    if (this.description) ld["dcterms:description"] = this.description;
    if (this.spatial) ld["dcterms:spatial"] = this.spatial;
    if (this.temporal) ld["dcterms:temporal"] = this.temporal;
    if (this.thumbnail) ld["edm:preview"] = this.thumbnail;
    if (this.duration) ld["dcterms:extent"] = this.duration;

    return ld;
  }
}

module.exports = CulturalObject;
