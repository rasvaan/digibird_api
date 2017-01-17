/*******************************************************************************
DigiBird Platforms

Functions used to retrieve information about the different platforms
incoorporated in DigiBird
*******************************************************************************/
var fs = require('fs');
var path = require('path');
var winston = require('winston');

var PLATFORM_FILE = path.join(__dirname, 'platforms.json');

module.exports = {
  platforms: function() {
    try {
      var contents = fs.readFileSync(PLATFORM_FILE, 'utf-8');
      var parsed = JSON.parse(contents);
    } catch (error) {
      winston.log('error', error);
    }

    return parsed;
  },
  platform: function(id) {
    const platform = this.platforms().find(platform => {
      return platform.id === id;
    });

    if (!platform) throw new Error(`${id} does not exist`);

    return platform;
  },
  platformIds: function() {
    return this.platforms().map(platform => platform.id);
  },
  exists: function(id) {
    var platforms = this.platforms();

    for (var i=0; i<platforms.length; i++) {
      if(platforms[i].id === id)
        return true;
    }
    return false;
  }
}
