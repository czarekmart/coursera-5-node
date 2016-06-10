module.exports = (function () {
    "use strict";

    var express = require('express');
    var bodyParser = require('body-parser');

// Create router
    var router = express.Router();

// This allows me to take advantage of req.body
    router.use(bodyParser.json());

    router.route('/')
        .put(function (req, res, next) {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            res.end("Invalid PUT request");
        })
        .all(function (req, res, next) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            next();
        })
        .get(function (req, res, next) {
            res.end('Will send all the promotions to you!');
        })
        .post(function (req, res, next) {
            res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
        })
        .delete(function (req, res, next) {
            res.end('Deleting all promotions');
        });

    router.route('/:id')

        .post(function (req, res, next) {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            res.end("Invalid POST request");
        })
        .all(function (req, res, next) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            next();
        })
        .get(function (req, res, next) {
            res.end('Will send details of the promotion: ' + req.params.id + ' to you!');
        })
        .put(function (req, res, next) {
            res.write('Updating the promotion: ' + req.params.id + '\n');
            res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
        })
        .delete(function (req, res, next) {
            res.end('Deleting promotion: ' + req.params.id);
        });

    return router;

})();

