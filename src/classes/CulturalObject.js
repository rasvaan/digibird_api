/*******************************************************************************
DigiBird CulturalObject class
Metadata about a pretty cultural heritage object
*******************************************************************************/
class CulturalObject {
  constructor(uri) {
    this.uri = uri;
  }
  toJSONLD() {
    return { "uri": this.uri };
  }
}

module.exports = CulturalObject;
