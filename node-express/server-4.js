var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var hostname = 'localhost';
var port = 3000;
var app = express();

app.use(morgan('dev'));

// Create router for dishes
var dishRouter = express.Router();

// This allows me to take advantage of req.body
dishRouter.use(bodyParser.json());

dishRouter.route('/').all(function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
})

    .get(function (req, res, next) {
        res.end('Will send all the dishes to you!');
    })

    .post(function (req, res, next) {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })

    .delete(function (req, res, next) {
        res.end('Deleting all dishes');
    });

dishRouter.route('/:dishId').all(function (req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    next();
})
    .get(function (req, res, next) {
        res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
    })
    .put(function (req, res, next) {
        res.write('Updating the dish: ' + req.params.dishId + '\n');
        res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete(function (req, res, next) {
        res.end('Deleting dish: ' + req.params.dishId);
    });


// This is assigning the router to route /dishes
app.use('/dishes', dishRouter);

// This allows me to request static files from the public folder
app.use(express.static(__dirname + '/public'));

// Here we start the server
app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});