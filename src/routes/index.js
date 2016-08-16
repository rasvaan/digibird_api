var utils = require('../helpers/utils');
//var blogCacheFile = require('../helpers/posts.json');

module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/people', function(req, res) {
        res.render('people');
    });

    app.get('/blog', function(req, res) {
        // get absolute path to blog file
        var pathBlogFile = path.resolve(__dirname, '..', 'helpers/posts.json');

        // get cached blog posts
        var blogPosts = utils.readJsonFile(pathBlogFile);

        // replace content between [ ]
        for (var i = 0; i < blogPosts.length; i++)
            blogPosts[i].content = blogPosts[i].content.replace(/\s*\[.*?\]\s*/g, '');

        var data = { posts: blogPosts };

        // send the blog posts to the client 'blog' page
        res.render('blog', data);
    });
};
