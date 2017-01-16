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
  addDate(date) {
    this.date = date;
  }
  toJSONLD() {
    let ld =
    {
      "@id": this.uri,
      "@type": this.type,
      "oa:hasTarget": this.target,
      "oa:hasBody": this.body
    };

    if (this.date) ld["oa:annotatedAt"] = this.date;

    return ld;
  }
}

module.exports = Annotation;
