// server backend to collect blog posts
// OPTION 2: works for both wordpress self-hosted websites and for websites hosted on wordpress.com. The WordPress XML-RPC API was included in Wordpress version 3.4 and higher

// Requires WordPress 3.4 or newer  and uses the WordPress XML-RPC API.
// source: https://github.com/scottgonzalez/node-wordpress

//run with the following command:
//node ./src/middlewares/blog2.js

var wordpress = require('wordpress');

var client = wordpress.createClient({
    //both websites work!
    url: 'https://sealincmedia.wordpress.com/',
    //url: 'http://invenit.wmprojects.nl',
    username: 'replaceWithUsername',
    password: 'replaceWithPassword'
});

client.getPosts(function(error, posts) {
    console.log("Found " + posts.length + " posts!");
    console.log("_____________________________");
    console.log(posts);
});
