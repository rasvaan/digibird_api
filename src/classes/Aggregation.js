/*******************************************************************************
DigiBird Aggregation class
Aggregation object with a structure corresponding to ore aggregations
*******************************************************************************/
class Aggregation {
  constructor(uri, culturalObject, webResource) {
    this.uri = uri;
    this.culturalObject = culturalObject;
    this.webResource = webResource;
    this.contextProperties = [
      "dcterms:type",
      "edm:aggregatedCHO",
      "edm:hasView"
    ];
  }
  addLicense(license) {
    this.license = license;
    this.contextProperties.push("dcterms:rights");
  }
  toJSONLD() {
    let jsonLd =
    {
      "@id": this.uri,
      "@type": "ore:Aggregation",
      "edm:aggregatedCHO": this.culturalObject.toJSONLD(),
      "edm:isShownBy": this.webResource.toJSONLD()
    };

    if (this.license) jsonLd["dcterms:rights"] = this.license;

    return jsonLd;
  }
}

module.exports = Aggregation;
