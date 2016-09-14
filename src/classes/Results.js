/*******************************************************************************
DigiBird Results class
Object containing Aggregations as results. Can convert results to every desired
supported serialization.
*******************************************************************************/
class Results {
  constructor() {
    this.results = [];
    this.platforms = [];
  }
  addAggregation(aggregation) {
    // add one Aggregation object to the aggregationss array
    this.results.push(aggregation);
  }
  addAggregations(aggregations) {
    // add an array of Aggregation objects to the aggregationss array
    this.results = this.results.concat(aggregations);
  }
  addPlatform(platform) {
    // add one platform to the platforms array
    this.platforms.push(platform);
  }
  addPlatforms(platforms) {
    // add an array to the platforms array
    this.platforms = this.platforms.concat(platforms);
  }
  getContext() {
    // construct the JSON-LD context object
    // TODO: make the platform xc line depend on the platform array
    const context =
    {
      "dcterms": "http://purl.org/dc/terms/",
      "dctype": "http://purl.org/dc/dcmitype/",
      "ore": "http://www.openarchives.org/ore/terms/",
      "edm": "http://www.europeana.eu/schemas/edm/",
      "xc": "http://www.xeno-canto.org/",
      "dcterms:type": {
        "@type": "@id"
      },
      "edm:aggregatedCHO": {
        "@type": "@id"
      },
      "edm:hasView": {
        "@type": "@id"
      }
    }

    return context;
  }
  toJSONLD() {
    const context = this.getContext();
    let aggregations = this.results.map(
      result => result.toJSONLD()
    );

    let json =
    {
      "@context": context,
      "@graph": aggregations
    }

    return json;
  }
}

module.exports = Results;
