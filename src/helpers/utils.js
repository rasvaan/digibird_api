/*******************************************************************************
DigiBird Utils

Functions used by multiple javascript files. These are used throughout the
application as helper tools.
*******************************************************************************/
var winston = require('winston');
var fs = require('fs');

module.exports = {
    writeJsonFile: function (file, data) {
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            winston.log('error', error);
        }
    },

    readJsonFile: function (file) {
        try {
            // read contents
            var contents = fs.readFileSync(file, 'utf-8');
            // parse
            var parsed = JSON.parse(contents);
        } catch (error) {
            winston.log('error', error);
        }

        return parsed;
    }
};
