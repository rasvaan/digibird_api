/*******************************************************************************
DigiBird WebResource class
WebResource representing data similar to an EDM web resource
*******************************************************************************/
class WebResource {
  constructor(uri, type) {
    this.uri = uri;
    this.type = type;
  }
  toJSON() {
    return { "uri": this.uri, "type": this.type };
  }
  toJSONLD() {
    return 'something fancier than this';
  }
}

module.exports = WebResource;
