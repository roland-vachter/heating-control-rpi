"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var needle = require('needle');
var routes = require('./routes/index');
var users = require('./routes/users');
var env = require('./env');
var ipify = require('ipify');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(function (req, res, next) {
    if (req.headers.api_key !== env.apiKeys.own.readOnly) {
	   res.send(403);
    } else {
        next();
    }
});*/

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


function updatedOwnIp() {
    ipify((err, ip) => {
        if (!err && ip) {
	    app.set('ip', ip);
            needle.post(env.registryAddress, {
            	address: 'http://' + ip + ':3000'
            }, {
            	headers: {
            		API_KEY: env.apiKeys.registry
            	}
			});
        }
    });
}
var interval = setInterval(updatedOwnIp, 30000);
updatedOwnIp();


module.exports = app;
