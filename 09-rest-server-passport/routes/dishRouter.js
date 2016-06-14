module.exports = (function(){
    "use strict";

    var express = require('express');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var Verify = require('./verify');

    var model = require('../models/dishes');

    var router = express.Router();
    router.use(bodyParser.json());

    router.route('/')
        .get(Verify.verifyOrdinaryUser, function (req, res, next) {
            model.find({})
                .populate('comments.postedBy')
                .exec(function (err, dishes) {
                    if (err) throw err;
                    res.json(dishes);
                });
        })

        .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
            model.create(req.body, function (err, dish) {
                if (err) throw err;
                console.log('Dish created!');
                var id = dish._id;

                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the dish with id: ' + id);
            });
        })

        .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
            model.remove({}, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });

    router.route('/:id')
        .get(Verify.verifyOrdinaryUser, function (req, res, next) {
            model.findById(req.params.id)
                .populate('comments.postedBy')
                .exec(function (err, dish) {
                    if (err) throw err;
                    res.json(dish);
                });
        })

        .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
            model.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, {
                new: true
            }, function (err, dish) {
                if (err) throw err;
                res.json(dish);
            });
        })

        .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
            model.findByIdAndRemove(req.params.id, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });

    router.route('/:dishId/comments')
        .all(Verify.verifyOrdinaryUser)

        .get(function (req, res, next) {
            model.findById(req.params.dishId)
                .populate('comments.postedBy')
                .exec(function (err, dish) {
                    if (err) throw err;
                    res.json(dish.comments);
                });
        })

        // Every logged user should be allowed to post comments
        .post(function (req, res, next) {
            model.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;
                req.body.postedBy = req.decoded._doc._id;
                dish.comments.push(req.body);
                dish.save(function (err, dish) {
                    if (err) throw err;
                    console.log('Updated Comments!');
                    res.json(dish);
                });
            });
        })

        .delete(Verify.verifyAdmin, function (req, res, next) {
            model.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;
                for (var i = (dish.comments.length - 1); i >= 0; i--) {
                    dish.comments.id(dish.comments[i]._id).remove();
                }
                dish.save(function (err, result) {
                    if (err) throw err;
                    res.writeHead(200, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('Deleted all comments!');
                });
            });
        });

    router.route('/:dishId/comments/:commentId')
        .all(Verify.verifyOrdinaryUser)

        .get(function (req, res, next) {
            model.findById(req.params.dishId)
                .populate('comments.postedBy')
                .exec(function (err, dish) {
                    if (err) throw err;
                    res.json(dish.comments.id(req.params.commentId));
                });
        })

        .put(function (req, res, next) {
            // We delete the existing commment and insert the updated
            // comment as a new comment
            model.findById(req.params.dishId, function (err, dish) {
                if (err) throw err;

                // Check if the dish is being removed by the author
                if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
                    var err = new Error('You are not authorized to perform this operation!');
                    err.status = 403;
                    return next(err);
                }

                var existingComment = dish.comments.id(req.params.commentId);
                var newComment = model.cloneComment (existingComment, req.body);

                existingComment.remove();

                console.log("sending PUT to comments", newComment);
                newComment.postedBy = req.decoded._doc._id;
                dish.comments.push(newComment);
                dish.save(function (err, dish) {
                    if (err) {
                        console.log("---------------------");
                        console.log("PUT error: ", err);
                        console.log("---------------------");
                        throw err;
                    }
                    console.log('Updated Comments!');
                    res.json(dish);
                });
            });
        })

        .delete(function (req, res, next) {
            model.findById(req.params.dishId, function (err, dish) {

                // Check if the dish is being removed by the author
                if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
                    var err = new Error('You are not authorized to perform this operation!');
                    err.status = 403;
                    return next(err);
                }
                dish.comments.id(req.params.commentId).remove();
                dish.save(function (err, resp) {
                    if (err) throw err;
                    res.json(resp);
                });
            });
        });

    return router;

})();


