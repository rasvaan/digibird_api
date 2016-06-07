module.exports.set = function(app) {

    app.get('/', function(req, res) {
        res.render('home');
    });

    app.get('/blog', function(req, res) {
        //   getCachedPosts
        //   populateBlogs
        var contextTitle = {title: "My New Post"};
        // var html    = template(context);

        // var context = {
        //   items: [
        //     {name: "Handlebars", emotion: "love"},
        //     {name: "Mustache", emotion: "enjoy"},
        //     {name: "Ember", emotion: "want to learn"}
        //   ]
        // };
        //
        // Handlebars.registerHelper('agree_button', function() {
        //   var emotion = Handlebars.escapeExpression(this.emotion),
        //       name = Handlebars.escapeExpression(this.name);
        //
        //   return new Handlebars.SafeString(
        //     "<button>I agree. I " + emotion + " " + name + "</button>"
        //   );
        // });

        res.render('blog', contextTitle);
    });
}
