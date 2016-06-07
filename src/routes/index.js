module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/blog', function(req, res) {
        //   getCachedPosts
        //   populateBlogs
        var samplePost = {
          title: "My new post",
          post: {
            message: "Hello world!!!",
            signature: "C.B."
          }
        };

        var contributors = [
          {name: 'larahack', institution: 'VU'},
          {name: 'rasvaan', institution: 'VU'}
        ];

        var data = {
          samplePost: samplePost,
          contributors: contributors
        };

        res.render('blog', data);
      });
};
