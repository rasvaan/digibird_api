var winston = require('winston');
var blogUtils = require('../helpers/blog');
var platformStatistics = require('../helpers/statistics');
var platforms = require('../helpers/platforms');
var objects = require('../helpers/objects');
var interpret = require('../helpers/request_interpretation');

module.exports.set = function(app) {

  app.get('/objects', function(req, res) {
    const parameters = interpret.objectParameters(req.query, res);

    if (parameters) {
      objects.get(parameters)
      .then(function(results) {
        let jsonLd = results.toJSONLD();

        res.json(jsonLd);
      }, function(error) {
        res.status(400).send(error.message);
      });
    }
  });

  app.get('/statistics', function(req, res) {
    const platformId = interpret.statisticsParameters(req.query, res);
    const platform = platforms.platform(platformId);

    if (platformId) {
      platformStatistics.get(platformId)
      .then(function(statistics) {
          res.json({ "platform": platform.name, "statistics": statistics });
      }, function(error) {
          res.status(404).send(`Statistics for ${platform.name} are not available at this moment`);
      });
    }
  });

  app.get('/platforms', function(req, res) {
    var platformInfo = platforms.platforms();
    res.json({platforms: platformInfo});
  });

  app.get('/blog', function(req, res) {
    //   get cached blog posts
    const blogPosts = blogUtils.readCacheJson();
    const filteredPosts = blogUtils.filter(blogPosts);
    // send the blog posts to the client 'blog' page
    res.json({ posts: blogPosts });
  });
};
