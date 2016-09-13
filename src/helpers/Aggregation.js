/*******************************************************************************
DigiBird integration module

*******************************************************************************/
class Aggregation {
  constructor(uri, object, webResource) {
    this.uri = uri;
    this.object = object; // simple string for now
    this.webResource = webResource; // simple string for now
  }
  toJSON() {
    const json =
    {
      "aggregation":
      {
        "uri": this.uri,
        "object": this.object,
        "webResource": this.webResource
      }
    };

    return json;
  }
  toJSONLD() {
    return 'something fancier than this';
  }
}

module.exports = Aggregation;
