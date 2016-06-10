var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var hostname = 'localhost';
var port = 3000;
var app = express();

//---------------------------
// Morgan middleware
//---------------------------
app.use(morgan('dev'));

//---------------------------
// Cookie parser middleware
//---------------------------
app.use(cookieParser('12345-67890-09876-54321')); // secret key

//---------------------------
// Auth middleware
//---------------------------
app.use(function (req, res, next) {
    console.log(req.headers);

    // If the user did not send an authorization cookie
    // it means s/he must send user-password for authorization

    if (!req.signedCookies.user) {
        var authHeader = req.headers.authorization;
        console.log("Received authorization: ", authHeader);
        console.log("----------------------------------------")
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
            console.log("Sending cookie back to the client");
            res.cookie('user', 'admin', {signed: true});
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
    else {
        console.log("signedCookies:", req.signedCookies);
        console.log("----------------------------------------");
        if (req.signedCookies.user === 'admin') {
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