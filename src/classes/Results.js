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
    // add one Aggregation object to the aggregations array
    this.results.push(aggregation);
  }
  addAggregations(aggregations) {
    // add an array of Aggregation objects to the aggregations array
    this.results = this.results.concat(aggregations);
  }
  addPlatform(platform) {
    // add one platform object to the platforms array
    this.platforms.push(platform);
  }
  addPlatforms(platforms) {
    // add an array to the platforms array
    this.platforms = this.platforms.concat(platforms);
  }
  getContext() {
    // construct the JSON-LD context object
    let context =
    {
      "dcterms": "http://purl.org/dc/terms/",
      "dctype": "http://purl.org/dc/dcmitype/",
      "ore": "http://www.openarchives.org/ore/terms/",
      "edm": "http://www.europeana.eu/schemas/edm/",
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

    context = this.addPrefixToContext(context);

    return context;
  }
  addPrefixToContext(context) {
    // iterate through platforms, adding prefix and namespace
    this.platforms.forEach((platform) => {
      context[platform.prefix] = platform.name_space;
    });

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
