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
    const jsonLd =
    {
      "@id": this.uri,
      "@type": "ore:Aggregation",
      "edm:aggregatedCHO": this.culturalObject.toJSONLD(),
      "edm:hasView": this.webResource.toJSONLD()
    };

    return jsonLd;
  }
}

module.exports = Aggregation;
