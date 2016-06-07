/*******************************************************************************
DigiBird Blog

Functions used by multiple javascript files. These are used throughout the
application as helper tools.
*******************************************************************************/
var winston = require('winston');
var fs = require('fs');


module.exports = {
    writeCacheJson: function (data) {
        try {
            fs.writeFileSync('./src/helpers/posts.json', JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            winston.log('error', error);
        }
    },

    readCacheJson: function () {
        try {
            // read contents
            var contents = fs.readFileSync('./src/helpers/posts.json', 'utf-8');
            // parse
            var parsed = JSON.parse(contents);
        } catch (error) {
            winston.log('error', error);
        }

        return parsed;
    }
};
