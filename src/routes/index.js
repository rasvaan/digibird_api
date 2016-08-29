var winston = require('winston');
var blogUtils = require('../helpers/blog');
var platformStatistics = require('../helpers/statistics');
var platforms = require('../helpers/platforms');

module.exports.set = function(app) {
  app.get('/blog', function(req, res) {
    //   get cached blog posts
    var blogPosts = blogUtils.readCacheJson();

    // replace content between [ ]
    for (var i=0; i<blogPosts.length; i++)
        blogPosts[i].content = blogPosts[i].content.replace(/\s*\[.*?\]\s*/g, '');

    // send the blog posts to the client 'blog' page
    res.json({ posts: blogPosts });
  });

  app.get('/statistics', function(req, res) {
    var platformId = req.query.platform;

    if(!platformId) {
      res.status(400).send('No platfom parameter provided');
    } else {
      var platform = platforms.platform(platformId);

      platformStatistics.statistics(platformId)
      .then(function(statistics) {
          res.json({ "platform": platform.name, "statistics": statistics });
      }, function(error) {
          winston.log('error', `Error connecting to ${platform.name}: ${error}`);
          res.status(404).send(`Statistics for ${platform.name} are not available at this moment`);
      });
    }
  });

  app.get('/platforms', function(req, res) {
    var platformInfo = platforms.platforms();
    res.json({platforms: platformInfo});
  });
};
