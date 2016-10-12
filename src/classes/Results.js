/*******************************************************************************
DigiBird Results class
Object containing Aggregations as results. Can convert results to every desired
supported serialization.
*******************************************************************************/
class Results {
  constructor(results, platformArray) {
    this.results = results || [];
    this.platforms = platformArray || [];
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
  createContext(propertySet, platforms) {
    // construct the JSON-LD context object
    let context =
    {
      "dcterms": "http://purl.org/dc/terms/",
      "dc": "http://purl.org/dc/elements/1.1/",
      "dctype": "http://purl.org/dc/dcmitype/",
      "ore": "http://www.openarchives.org/ore/terms/",
      "edm": "http://www.europeana.eu/schemas/edm/"
    }
    context = this.addPrefixToContext(context, platforms);
    context = this.addProperties(context, propertySet);

    return context;
  }
  addProperties(context, properties) {
    // specify the properties that have uris as values
    properties.forEach((property) => {
      context[property] = {"@type":'@id'};
    });

    return context;
  }
  addPrefixToContext(context) {
    // iterate through platforms, adding prefix and namespace
    this.platforms.forEach((platform) => {
      context[platform.prefix] = platform.name_space;
    });

    return context;
  }
  contextProperties() {
    let contextProperties = [];

    this.results.forEach(aggregation => {
      // find properties that might be added
      let candidates = contextProperties.concat(
        aggregation.contextProperties,
        aggregation.culturalObject.contextProperties,
        aggregation.webResource.contextProperties
      );

      // only add property when not already present
      candidates.forEach(candidate => {
        if (!contextProperties.includes(candidate)) {
          contextProperties.push(candidate);
        }
      });
    });

    return contextProperties;
  }
  toJSONLD() {
    let context, properties, aggregations;

    properties = this.contextProperties();
    context = this.createContext(properties, this.platforms);
    aggregations = this.results.map(
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
