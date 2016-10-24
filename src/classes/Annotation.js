/*******************************************************************************
DigiBird Annotation class
Annotation representing data similar to the web annotation data model
*******************************************************************************/
class Annotation {
  constructor(uri, target, body) {
    this.uri = uri;
    this.target = target;
    this.body = body;
    this.type = 'oa:Annotation';
    this.contextProperties = [
      "oa:hasTarget"
    ];
  }
  toJSONLD() {
    const jsonLd =
    {
      "@id": this.uri,
      "@type": this.type,
      "oa:hasTarget": this.target,
      "oa:hasBody": this.body
    };

    return jsonLd;
  }
}

module.exports = Annotation;
