/*******************************************************************************
DigiBird blog posts retrieval

This is the server backend to collect blog posts related to DigiBird.

OPTION 1: works for wordpress self-hosted websites. For websites hosted on
wordpress.com, you cannot add the WP-API v2 plugin, so the Wordpress REST API
cannot be used.

Client for the WordPress REST API (source:
https://github.com/kadamwhite/wordpress-rest-api), designed to work with
WP-API v2 or higher (source: https://github.com/WP-API/WP-API)

Run with the following command:
node ./src/middlewares/blog1.js
*******************************************************************************/

var utils = require('../helpers/blog');
var WP = require('wordpress-rest-api');

var user = 'replaceWithUsername';

var wp = new WP({
  //endpoint: 'https://sealincmedia.wordpress.com/wp-json', //does not work here
  endpoint: 'http://invenit.wmprojects.nl/wp-json',
  username: user,
  password: 'replaceWithPassword'
});

//get info about users
wp.users().then(function(users) {
  // do something with the returned users
  console.log("users in!");
  // utils.writeOutputToFile('debug1.log', "USERS", users);
  utils.dumpToFile('debug1.log', "USERS", users);
}).catch(function(err) {
  // handle error
  console.log("Error retrieving users! Check log file for more info.");
  // utils.writeOutputToFile('debug1.log', "ERROR: users", err);
  utils.dumpToFile('debug1.log', "ERROR: users", err);
});

//retrieve blog posts
wp.posts().then(function(posts) {
  // do something with all the returned posts
  console.log("posts in!");
  // utils.writeOutputToFile('debug1.log', "POSTS", posts);
  utils.dumpToFile('debug1.log', "POSTS", posts);
}).catch(function(err) {
  // handle error
  console.log("Error retrieving posts! Check log file for more info");
  // utils.writeOutputToFile('debug1.log', "ERROR: posts", err);
  utils.dumpToFile('debug1.log', "ERROR: posts", err);
});

//retrieve filtered blog posts: by user, by tag, etc.
wp.posts().filter({
  author_name: user
}).then(function(posts) {
  // do something with the returned filtered posts
  console.log("filtered posts in!");
  // utils.writeOutputToFile('debug1.log', "FILTERED POSTS BY USER " + user, posts);
  utils.dumpToFile('debug1.log', "FILTERED POSTS BY USER " + user, posts);
}).catch(function(err) {
  // handle error
  console.log("Error retrieving posts! Check log file for more info");
  // utils.writeOutputToFile('debug1.log', "ERROR: filtered posts, user " + user, err);
  utils.dumpToFile('debug1.log', "ERROR: filtered posts, user " + user, err);
});
