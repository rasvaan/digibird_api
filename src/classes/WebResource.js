/*******************************************************************************
DigiBird WebResource class
WebResource representing data similar to an EDM web resource
*******************************************************************************/
class WebResource {
  constructor(uri, type) {
    this.uri = uri;
    this.type = type;
  }
  toJSONLD() {
    return { "uri": this.uri, "type": this.type };
  }
}

module.exports = WebResource;
