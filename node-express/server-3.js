var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var hostname = 'localhost';
var port = 3000;
var app = express();

app.use(morgan('dev'));

// This allows me to take advantage of req.body
app.use(bodyParser.json());

// Here is the routing for /dishes path
app.all('/dishes', function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
});
app.get('/dishes', function (req, res, next) {
    res.end('Will send all the dishes to you!');
});
app.post('/dishes', function (req, res, next) {
    console.log("Received body: ", req.body);
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
});
app.delete('/dishes', function (req, res, next) {
    res.end('Deleting all dishes');
});

// Here is the routing for dishes/id
app.get('/dishes/:dishId', function (req, res, next) {
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
});
app.put('/dishes/:dishId', function (req, res, next) {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
});
app.delete('/dishes/:dishId', function (req, res, next) {
    res.end('Deleting dish: ' + req.params.dishId);
});

// This allows me to request static files from the public folder
app.use(express.static(__dirname + '/public'));

// Here we start the server
app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});