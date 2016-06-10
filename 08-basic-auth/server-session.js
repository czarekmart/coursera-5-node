var express = require('express');
var morgan = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var hostname = 'localhost';
var port = 3000;
var app = express();

//---------------------------
// Morgan middleware
//---------------------------
app.use(morgan('dev'));

//---------------------------
// Session middleware
//---------------------------
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: true,
    resave: true,
    store: new FileStore()
}));

//---------------------------
// Auth middleware
//---------------------------
app.use(function (req, res, next) {

    console.log(req.headers);

    if ( !req.session.useCount ) {
        req.session.useCount = 1;
    }
    req.session.useCount++;
    if (req.session.useCount >= 5) {
        req.session.user = '';
        req.headers.authorization = '';
        req.session.useCount = 1;
    }

    // If the user did not send an authorization cookie
    // it means s/he must send user-password for authorization

    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        console.log("Received authorization: ", authHeader);
        console.log("----------------------------------------");
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
            return;
        }

        var decoded = new Buffer(authHeader.split(' ')[1], 'base64').toString();
        console.log("Decoded: ", decoded);
        console.log("----------------------------------------");
        var auth = decoded.split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            console.log("Setting session.user");
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        console.log("----------------------------------------");
        if (req.session.user === 'admin') {
            console.log('req.session: ', req.session);
            console.log("----------------------------------------");
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
});

//---------------------------------
// static file middleware
//---------------------------------
app.use(express.static(__dirname + '/public'));

//---------------------------------
// Error handler middleware
//---------------------------------
app.use(function (err, req, res, next) {
    res.writeHead(err.status || 500, {
        'WWW-Authenticate': 'Basic',
        'Content-Type': 'text/plain'
    });
    res.end(err.message);
});


app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});