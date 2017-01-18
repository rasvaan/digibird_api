var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var winston = require('winston');
var blog = require('./middlewares/blog');
var routes = require('./routes');
var Errors = require('./classes/Errors')
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
  res.status(404).send('Not found');
});

// error handlers
app.use(function(err, req, res, next) {
  winston.log('error', err);
  if (res.headersSent) {
    winston.log('error', 'Caught an error, but headers already sent. Might be an issue we need to resolve');
  } else {
    if (err instanceof Errors.Error) {
      const status = err.statusCode || 500;
      const message = err.message || 'Internal server error';
      res.status(status).send(message);
    } else {
      res.status(500).send('Internal server error');
    }
  }
});

app.listen(3030, function() {
  winston.log('info', 'Started server on 3030.');
});
