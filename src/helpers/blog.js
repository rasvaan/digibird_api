/*******************************************************************************
DigiBird Blog

Functions used by multiple javascript files. These are used throughout the
application as helper tools.
*******************************************************************************/

module.exports = {
    writeCacheJson: function (data) {
        var fs = require('fs');
        fs.writeFileSync('./src/helpers/posts.json', JSON.stringify(data, null, 2), 'utf-8');
    },

    readCacheJson: function () {
        var fs = require('fs');
        var contents = fs.readFileSync('./src/helpers/posts.json', 'utf-8');

        return JSON.parse(contents);
    }
};
