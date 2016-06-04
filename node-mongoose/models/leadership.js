"use strict";

module.exports = (function(){

    // grab the things we need
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

//---------------------------------------
// leaderSchema
//---------------------------------------
    var leaderSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true  // there can't be a true leader without an inspiring picture!
        },
        designation: {
            type: String,
            required: true  // what is (s)he a leader of?
        },
        abbr: {
            type: String
        },
        description: {
            type: String
        }
    }, {
        timestamps: true
    });

//-------------------------------------
// Create the model
//-------------------------------------
    var Leader = mongoose.model('Leader', leaderSchema);

    return Leader;
})();
