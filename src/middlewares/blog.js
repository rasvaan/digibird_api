/*******************************************************************************
DigiBird blog posts retrieval

This is the server backend to collect blog posts related to DigiBird.

Works for both wordpress self-hosted websites and for websites hosted on wordpress.com.
The WordPress XML-RPC API was included in Wordpress version 3.4 and higher.

Requires WordPress 3.4 or newer and uses the WordPress XML-RPC API
(source: https://github.com/scottgonzalez/node-wordpress).
*******************************************************************************/
var wordpress = require('wordpress');
var credentials = require('./wordpress_credentials');
var fs = require('fs');
var winston = require('winston');

module.exports = {
  getPosts: function() {
    const _this = this;

    this.getWordpressPosts().then(posts => {
      const digibirdPosts = _this.filterDigibirdPosts(posts);

      // write digibird blog posts to cache file
      if (digibirdPosts.length != 0) {
        _this.writeCacheJson(digibirdPosts);
      } else {
        winston.log('warning', "No posts found with DigBird tag.");
      }
    }, function(error) {
      winston.log('error', "Error retrieving posts.");
    });
  },
  getWordpressPosts: function() {
    const client = wordpress.createClient({
      url: 'https://sealincmedia.wordpress.com/',
      username: credentials.USERNAME,
      password: credentials.PASSWORD
    });

    return new Promise (function(resolve, reject) {
      client.getPosts(function(error, posts) {
        if (error) reject(error);
        resolve(posts);
      });
    });
  },
  filterDigibirdPosts: function(posts) {
    let digibirdPosts = [];

    // go through all the posts
    for (let i=0; i<posts.length; i++) {
      if (posts[i].terms) {
        // go through the possible taxonomy terms
        for (let j=0; j<posts[i].terms.length; j++) {
          // check if a post with a 'digibird' tag is found
          if (posts[i].terms[j].taxonomy === 'post_tag' &&
          posts[i].terms[j].name.toLowerCase() === 'digibird') {
            // if yes, add it to the list of blog posts
            digibirdPosts.push(posts[i]);
            break;
          }
        }
      }
    }

    return digibirdPosts;
  },
  writeCacheJson: function (data) {
    try {
      fs.writeFileSync('./src/middlewares/posts.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      winston.log('error', error);
    }
  },
  readCacheJson: function () {
    // read contents
    const contents = fs.readFileSync('./src/middlewares/posts.json', 'utf-8');
    // parse
    const parsed = JSON.parse(contents);

    return parsed;
  },
  filterTextPosts: function(posts) {
    // replace content between [ ]
    for (let i=0; i<posts.length; i++) {
      if (posts[i].content)
        posts[i].content = posts[i].content.replace(/\[.*?\]/g, '');
    }

    return posts;
  }
}
