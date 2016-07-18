var blogUtils = require('../helpers/blog');

module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/blog', function(req, res) {
        //   get cached blog posts
        var blogPosts = blogUtils.readCacheJson();
        var data = { posts: blogPosts };

        // send the blog posts to the client 'blog' page
        res.render('blog', data);
    });
};
