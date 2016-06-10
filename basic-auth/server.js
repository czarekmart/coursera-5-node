var express = require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 3000;
var app = express();

//---------------------------
// Morgan middleware
//---------------------------
app.use(morgan('dev'));

//---------------------------
// Auth middleware
//---------------------------
app.use(function (req, res, next) {
    console.log(req.headers);
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
    console.log("----------------------------------------")
    var auth = decoded.split(':');
    var user = auth[0];
    var pass = auth[1];
    if (user == 'admin' && pass == 'password') {
        next(); // authorized
    } else {
        var err = new Error('You are not authenticated!');
        err.status = 401;
        next(err);
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