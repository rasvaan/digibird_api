/*******************************************************************************
DigiBird Aggregation class
Aggregation object with a structure corresponding to ore aggregations
*******************************************************************************/
class Aggregation {
  constructor(uri, culturalObject, webResource) {
    this.uri = uri;
    this.culturalObject = culturalObject;
    this.webResource = webResource;
  }
  toJSON() {
    const json =
    {
      "aggregation":
      {
        "uri": this.uri,
        "object": this.culturalObject.toJSON(),
        "web_resource": this.webResource.toJSON()
      }
    };

    return json;
  }
  toJSONLD() {
    return 'something fancier than this';
  }
}

module.exports = Aggregation;
