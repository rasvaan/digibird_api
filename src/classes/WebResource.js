/*******************************************************************************
DigiBird WebResource class
WebResource representing data similar to an EDM web resource
*******************************************************************************/
class WebResource {
  constructor(uri, type) {
    this.uri = uri;
    this.type = 'edm:WebResource';
    this.dctermsType = type;
    this.contextProperties = [];
  }
  toJSONLD() {
    const jsonLd =
    {
      "@id": this.uri,
      "@type": this.type,
      "dcterms:type": this.dctermsType
    };

    return jsonLd;
  }
}

module.exports = WebResource;
