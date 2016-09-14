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
  toJSONLD() {
    const json =
    {
      "aggregation":
      {
        "uri": this.uri,
        "object": this.culturalObject.toJSONLD(),
        "web_resource": this.webResource.toJSONLD()
      }
    };

    return json;
  }
}

module.exports = Aggregation;
