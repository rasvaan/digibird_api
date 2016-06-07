var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var blog = require('./middlewares/blog');
var routes = require('./routes');

var app = express();

app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
routes.set(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use('/bs', express.static(path.resolve(__dirname, '..', 'node_modules', 'bootstrap/dist/')));

// scheduled tasks
setInterval(function() {
    // cache digibird blogposts
    blog.getPosts();

    // 1 hour delay
}, 3600000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message
        });
    });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message
    });
});


app.listen(3000, function() {});
