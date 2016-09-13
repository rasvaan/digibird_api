/*******************************************************************************
DigiBird CulturalObject class
Metadata about a pretty cultural heritage object
*******************************************************************************/
class CulturalObject {
  constructor(uri) {
    this.uri = uri;
  }
  toJSON() {
    return { "uri": this.uri };
  }
  toJSONLD() {
    return 'something fancier than this';
  }
}

module.exports = CulturalObject;
