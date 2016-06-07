/*******************************************************************************
DigiBird blog posts retrieval

This is the server backend to collect blog posts related to DigiBird.

Works for both wordpress self-hosted websites and for websites hosted on wordpress.com.
The WordPress XML-RPC API was included in Wordpress version 3.4 and higher.

Requires WordPress 3.4 or newer and uses the WordPress XML-RPC API
(source: https://github.com/scottgonzalez/node-wordpress).

Run with the following command (should be scheduled in the end):
node ./src/middlewares/blog.js
*******************************************************************************/

var wordpress = require('wordpress');
var blogUtils = require('../helpers/blog');
var credentials = require('./wordpress_credentials');

var client = wordpress.createClient({
    url: 'https://sealincmedia.wordpress.com/',
    username: credentials.USERNAME,
    password: credentials.PASSWORD
});

var digibirdPosts = [];

client.getPosts(function(error, posts) {
    // go through all the posts
    for (var i = 0; i < posts.length; i++) {
        // go through the possible taxonomy terms
        for (var j = 0; j < posts[i].terms.length; j++) {
            // check if a post with a 'digibird' tag is found
            if (posts[i].terms[j].taxonomy === 'post_tag' &&
            posts[i].terms[j].name.toLowerCase() === 'digibird') {
                // if yes, add it to the list of blog posts
                digibirdPosts.push(posts[i]);
                break;
            }
        }
    }
    // write digibird blog posts to cache file
    if (digibirdPosts.length != 0) {
        blogUtils.cacheJson(digibirdPosts);
    }
    // TODO: error handling
});
