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
  },
  filter: function(posts) {
    // replace content between [ ]
    for (let i=0; i<posts.length; i++)
        posts[i].content = posts[i].content.replace(/\s*\[.*?\]\s*/g, '');

    return posts;
  }
};
