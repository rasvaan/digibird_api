module.exports.set = function(app) {

  app.get('/', function(req, res) {
      res.render('home');
  });

  app.get('/blog', function(req, res) {
      res.render('blog');
  });
}
