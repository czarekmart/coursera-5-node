var express = require('express');
var morgan = require('morgan');
var hostname = 'localhost';
var port = 3000;
var app = express();

app.use(morgan('dev'));

// Create routers
var dishRouter = require("./dishRouter.js");
var promoRouter = require("./promoRouter.js");
var leaderRouter = require("./leaderRouter.js");


// This is assigning the router to route /dishes
app.use('/dishes', dishRouter);

// This is assigning the router to route /promotions
app.use('/promotions', promoRouter);

// This is assigning the router to route /leadership
app.use('/leadership', leaderRouter);

// This allows me to request static files from the public folder
app.use(express.static(__dirname + '/public'));

// Here we start the server
app.listen(port, hostname, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});
