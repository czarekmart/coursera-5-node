module.exports = (function(){
    "use strict";

    var express = require('express');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var Verify = require('./verify');

    var model = require('../models/favorites');

    var router = express.Router();
    router.use(bodyParser.json());

    router.route('/')
        //--------------------------------------------------------
        // Here we retrieve all favorites of the currently
        // logged user, so we have to query for the postedBy
        //--------------------------------------------------------
        .get(Verify.verifyOrdinaryUser, function (req, res, next) {
            model.findOne({postedBy: req.decoded._doc._id})
                .populate('dishes')
                .populate('postedBy')
                .exec(function (err, fav) {
                    res.json(fav);
                });
        })


        //--------------------------------------------------------------
        // Here we add a new favorite for the currently logged user.
        // The body must contain the id of favorite dish, therefore
        // we cannot explicitly add a favorite object here, but instead
        // we have to check if the favorite document for the user already
        // exists, and then we either add favorite to existing document
        // or we create a new one.
        //--------------------------------------------------------------
        .post(Verify.verifyOrdinaryUser, function (req, res, next) {
            model.findOne({postedBy: req.decoded._doc._id}, function (err, fav) {
                if (!fav) {
                    fav = new model();
                    fav.postedBy = req.decoded._doc._id;
                }
                if (fav.dishes.indexOf(req.body._id) < 0) {
                    fav.dishes.push(req.body._id);
                    fav.save(function (err, fav) {
                        if (err) throw err;
                    });
                }
                res.json(fav);
            });
        })

        //--------------------------------------------------
        // Remove only favorites of the current user
        //--------------------------------------------------
        .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
            model.remove({postedBy: req.decoded._doc._id}, function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });

    //--------------------------------------------------
    // By assignment requirements id is NOT favorite id,
    // but it's a dish id.
    //---------------------------------------------------
    router.route('/:id')
        .delete(Verify.verifyOrdinaryUser, function (req, res, next) {

            model.findOne({postedBy: req.decoded._doc._id}, function(err, favDoc) {
                if ( favDoc && favDoc.dishes ) {
                    var index = favDoc.dishes.indexOf(req.params.id);
                    if (index > -1) {
                        favDoc.dishes.splice(index, 1);
                        favDoc.save(function(err, result){
                            if (err) throw err;
                        });
                    }
                }
                res.json(favDoc||{});
            });
        });

    return router;

})();


