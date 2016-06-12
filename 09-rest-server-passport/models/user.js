module.exports = (function(){
	"use strict";

	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	var passportLocalMongoose = require('passport-local-mongoose');

	var userSchema = new Schema({
		username: String,
		password: String,
		admin: {
			type: Boolean,
			default: false
		}
	});

	userSchema.plugin(passportLocalMongoose);

	var model = mongoose.model('User', userSchema);
	return model;
})();

