var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');

var blog = require('./middlewares/blog');
var routes = require('./routes');

var app = express();

routes.set(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// logging to file
winston.add(winston.transports.File, {filename: 'digibird_api.log'});

// scheduled tasks
setInterval(function() {
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
app.use(function(err, req, res, next) {
    winston.log(err);
});


app.listen(3030, function() {
    winston.log('info', 'Started server on 3030.');
});
