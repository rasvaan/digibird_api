/*******************************************************************************
DigiBird blog posts retrieval

This is the server backend to collect blog posts related to DigiBird.

OPTION 2: works for both wordpress self-hosted websites and for websites hosted on wordpress.com. The WordPress XML-RPC API was included in Wordpress version 3.4 and higher.

Requires WordPress 3.4 or newer and uses the WordPress XML-RPC API
(source: https://github.com/scottgonzalez/node-wordpress).

Run with the following command:
node ./src/middlewares/blog2.js
*******************************************************************************/

var wordpress = require('wordpress');
var utils = require('../helpers/blog');

var user = 'replaceWithUsername';

var client = wordpress.createClient({
    // both websites work!
    url: 'https://sealincmedia.wordpress.com/',
    // url: 'http://invenit.wmprojects.nl',
    username: user,
    password: 'replaceWithPassword'
});

var digibirdPosts = [];

client.getPosts(function(error, posts) {
  // go through all the posts
  for (var i = 0; i < posts.length; i++)
    // go through the possible taxonomy terms
    for (var j = 0; j < posts[i].terms.length; j++) {
      // check if a post with a 'digibird' tag is found
      if (posts[i].terms[j].taxonomy === 'post_tag' &&
          posts[i].terms[j].name.toLowerCase() === 'digibird')
        // if yes, add it to the list of blog posts
        digibirdPosts.push(posts[i]);
        break;
      }
    // write digibird blog posts to cache file
    if (digibirdPosts.length != 0) {
      // utils.writeOutputToFile('debug1.log', "FILTERED POSTS BY USER " + user, posts);
      utils.dumpToFile('debug2.log', "DIGIBIRD POSTS ", digibirdPosts);
    }
    // TODO: error handling
});
