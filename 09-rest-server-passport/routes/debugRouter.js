//-----------------------------------------------------------------
// Setting the admin:
// > mongo
// > use conFusion
// > db.users.find().pretty();
// > db.users.update({username: "admin"}, {$set: {admin:true}});
//------------------------------------------------------------------


module.exports = (function(){
  "use strict";

  var express = require('express');
  var router = express.Router();
  var passport = require('passport');
  var Verify = require('./verify');

  var User = require('../models/user');
  var Favorites = require('../models/favorites');
  var Dishes = require('../models/dishes');
  var Promos = require('../models/promotions');
  var Leaders = require('../models/leadership');


  /* GET users listing. */
  router.get('/', function (req, res, next) {
    User.find({}, function (err, users) {
      if (err) throw err;
      res.json(users);
    });
  });

  router.get('/userinfo', Verify.verifyOrdinaryUser, function (req, res, next) {
    User.find({}, function (err, users) {
      if (err) throw err;
      var output = {
        users: users,
      };
      if (req.decoded) {
        output.currentUser = {
          id: req.decoded._doc._id,
          admin: req.decoded._doc.admin
        };
      }
      res.json(output);
    });
  });

  router.get('/users', function (req, res, next) {
    User.find({}, function (err, users) {
      if (err) throw err;
      res.json(users);
    });
  });

  router.get('/dishes', function (req, res, next) {
    Dishes.find({}, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  router.get('/favorites', function (req, res, next) {
    Favorites.find({}, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  router.get('/promos', function (req, res, next) {
    Promos.find({}, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  router.get('/leaders', function (req, res, next) {
    Leaders.find({}, function (err, result) {
      if (err) throw err;
      res.json(result);
    });
  });

  router.post('/makeadmin', function (req, res, next) {
    User.findOne({username: "admin"}, function (err, admin) {
      if (err) throw err;
      admin.admin = true;
      admin.save(function(err, saveResp) {
        if ( err ) {
          res.json({message: "Cannot make admin", error: err});
        }
        else {
          res.json(saveResp);
        }
      });
    });
  });

  return router;

})();
