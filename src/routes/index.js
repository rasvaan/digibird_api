module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/blog', function(req, res) {
        //   getCachedPosts
        //   populateBlogs
        res.render('blog');
    });
}
