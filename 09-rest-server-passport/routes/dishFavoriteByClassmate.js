var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');
var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
	.get(Verify.verifyOrdinaryUser, function (req, res, next) {
		Favorites.find({postedBy: req.decoded._doc._id})
			.populate('postedBy')
			.populate('dishes')
			.exec(function (err, favorite) {
				if (err) throw err;
				res.json(favorite);
			});
	})

	.post(Verify.verifyOrdinaryUser, function (req, res, next) {
		Favorites.findOneAndUpdate(
			{"postedBy": req.decoded._doc._id},
			{},
			{new: true, upsert: true},
			function (err, favorite) {
				if (err) throw err;

				favorite.dishes.push(req.body);
				favorite.save(function (err, favorite) {
					if (err) throw err;
					console.log('Updated Favorites!');
					res.json(favorite);
				});


			});

		/*Favorites.create(req.body, function (err, favorite) {
		 if (err) throw err;
		 req.body.postedBy = req.decoded._doc._id;
		 //favorite.dishes.push(req.body);
		 console.log('Favorite created!');
		 res.json(req.body);
		 //res.writeHead(200, {
		 //    'Content-Type': 'text/plain'
		 //});

		 //res.end('Added the dish with id: ' + id);
		 });
		 */
	})

	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		Favorites.remove({postedBy: req.decoded._doc._id}, function (err, resp) {
			if (err) throw err;
			res.json(resp);
		});
	});
favoriteRouter.route('/:dishId')
	.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
		Favorites.findOne({postedBy: req.decoded._doc._id})
			.populate('postedBy')
			.populate('dishes')
			.exec(function (err, favorite) {
				if (favorite.postedBy.id
					!= req.decoded._doc._id) {
					var err = new Error('You are not authorized to perform this operation!');
					err.status = 403;
					console.log(favorite.postedBy);
					console.log(favorite.id);
					return next(err);

				}
				console.log(favorite.postedBy);
				console.log(favorite.id);
				favorite.dishes.pull({_id: req.params.dishId});
				favorite.save(function (err, resp) {
					if (err) throw err;
					res.json(resp);
				});
			});
	});


module.exports = favoriteRouter;

