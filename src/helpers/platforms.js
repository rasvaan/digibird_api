/*******************************************************************************
DigiBird Platforms

Functions used to retrieve information about the different platforms
incoorporated in DigiBird
*******************************************************************************/
var fs = require('fs');
var path = require('path');

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
        return this.platforms().find(function(platform) {
            return platform.id === id;
        });
    },
    platformIds: function() {
        var data = this.platforms();
        var platformIds = [];

        for (var i=0; i<data.length; i++)
            platformIds[i] = data[i].id;

        return platformIds;
    }
}
