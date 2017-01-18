var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var blog = require('./middlewares/blog');
var routes = require('./routes');
var Errors = require('./classes/Errors')
var RequestErrors = require('request-promise-native/errors');
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
  winston.log('error', `404 location ${req.url} not found`);
  res.status(404).send('Not found');
});

// error handlers
app.use(function(err, req, res, next) {
  if (err instanceof Errors.Error) {
    const status = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    winston.log('error', `${status} ${message}`);
    res.status(status).send(message);
  } else if (err instanceof RequestErrors.RequestError) {
    winston.log('error', `500 ${err.error.message}`);
    res.status(500).send('Internal server error');
  } else {
    winston.log('error', err);
    res.status(500).send('Internal server error');
  }
});

app.listen(3030, function() {
  winston.log('info', 'Started server on 3030.');
});
