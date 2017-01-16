/*******************************************************************************
DigiBird Aggregation class
Aggregation object with a structure corresponding to ore aggregations
*******************************************************************************/
class Aggregation {
  constructor(uri, culturalObject, webResource) {
    this.uri = uri;
    this.culturalObject = culturalObject;
    this.webResource = webResource;
    this.views = [];
    this.contextProperties = [
      "dcterms:type",
      "edm:aggregatedCHO",
      "edm:isShownBy"
    ];
  }
  addLicense(license) {
    this.license = license;
    this.contextProperties.push("dcterms:rights");
  }
  addView(webResource) {
    // add another view
    if (this.views.length === 0) this.contextProperties.push("edm:hasView");
    this.views.push(webResource);
  }
  toJSONLD() {
    let ld =
    {
      "@id": this.uri,
      "@type": "ore:Aggregation",
      "edm:aggregatedCHO": this.culturalObject.toJSONLD(),
      "edm:isShownBy": this.webResource.toJSONLD()
    };

    if (this.license) ld["dcterms:rights"] = this.license;
    if (this.views.length > 0) ld = this.JSONLDViews(ld);

    return ld;
  }
  JSONLDViews(ld) {
    // add possibly multiple additional views to json object
    if (this.views.length === 1) {
      // add single object
      ld["edm:hasView"] = this.views[0].toJSONLD();
    } else {
      ld["edm:hasView"] = [];

      for (let i=0; i<this.views.length; i++) {
        // add json views to array of views
        ld["edm:hasView"].push(this.views[i].toJSONLD());
      }
    }

    return ld;
  }
}

module.exports = Aggregation;
