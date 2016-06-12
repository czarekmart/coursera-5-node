module.exports = (function () {
	"use strict";

	var express = require('express');
	var bodyParser = require('body-parser');
	var mongoose = require('mongoose');
	var Verify = require('./verify');

	var model = require('../models/leadership');

	var router = express.Router();
	router.use(bodyParser.json());

	router.route('/')
		.get(Verify.verifyOrdinaryUser, function (req, res, next) {
			model.find({}, function (err, leaders) {
				if (err) throw err;
				res.json(leaders);
			});
		})

		.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
			model.create(req.body, function (err, leader) {
				if (err) throw err;
				console.log('Leader created!');
				var id = leader._id;

				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Added the leader with id: ' + id);
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
			model.findById(req.params.id, function (err, leader) {
				if (err) throw err;
				res.json(leader);
			});
		})

		.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
			model.findByIdAndUpdate(req.params.id, {
				$set: req.body
			}, {
				new: true
			}, function (err, leader) {
				if (err) throw err;
				res.json(leader);
			});
		})

		.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
			model.findByIdAndRemove(req.params.id, function (err, resp) {
				if (err) throw err;
				res.json(resp);
			});
		});

	return router;

})();


