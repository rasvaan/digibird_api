var blogUtils = require('../helpers/blog');

module.exports.set = function(app) {
    app.get('/blog', function(req, res) {
        //   get cached blog posts
        var blogPosts = blogUtils.readCacheJson();

        // replace content between [ ]
        for (var i=0; i<blogPosts.length; i++)
            blogPosts[i].content = blogPosts[i].content.replace(/\s*\[.*?\]\s*/g, '');

        // send the blog posts to the client 'blog' page
        res.send(JSON.stringify({ posts: blogPosts }));
    });
};
