var winston = require('winston');
var blog = require('../middlewares/blog');
var platformStatistics = require('../helpers/statistics');
var platformAnnotations = require('../helpers/annotations');
var platforms = require('../helpers/platforms');
var objects = require('../helpers/objects');
var interpret = require('../helpers/request_interpretation');
var output = require('../helpers/output');
var Results = require('../classes/Results');

module.exports.set = function(app) {

  app.get('/objects', function(req, res) {
    interpret.objectParameters(req.query)
    .then(parameters => {
      objects.get(parameters)
      .then(resultsArray => {
        let mergedResults = new Results();

        // simple merge of results
        resultsArray.forEach((results) => {
          mergedResults.addAggregations(results.results);
          mergedResults.addPlatform(results.platforms[0]);
        });

        // convert to json-ld and output
        let jsonLd = mergedResults.toJSONLD();
        // reply results according to request header
        output.contentNegotiation(res, jsonLd);
      });
    });
  });

  app.get('/annotations', function(req, res) {
    const parameters = interpret.annotationParameters(req.query);

    if (parameters) {
      if (parameters.date) {
        parameters.request = 'annotations_since';

        platformAnnotations.since(parameters)
        .then(function(results) {
          let jsonLd = results.toJSONLD();
          // reply results according to request header
          output.contentNegotiation(res, jsonLd);
        }, function(error) {
          res.status(404).send(error.message);
        });
      } else {
        parameters.request = 'annotations';

        platformAnnotations.get(parameters)
        .then(function(results) {
          let jsonLd = results.toJSONLD();
          // reply results according to request header
          output.contentNegotiation(res, jsonLd);
        }, function(error) {
          res.status(404).send(error.message);
        });
      }
    }
  });

  app.get('/statistics', function(req, res) {
    const platformId = interpret.platformParameter(req.query);
    const platform = platforms.platform(platformId);

    platformStatistics.get(platformId)
    .then(statistics => {
      res.json({ "platform": platform.name, "statistics": statistics });
    });
  });

  app.get('/platforms', function(req, res) {
    res.json({ platforms: platforms.platforms() });
  });

  app.get('/blog', function(req, res) {
    // get cached blog posts
    const blogPosts = blog.readCacheJson();
    const filteredPosts = blog.filterTextPosts(blogPosts);

    // send the blog posts to the client 'blog' page
    res.json({ posts: blogPosts });
  });

};
