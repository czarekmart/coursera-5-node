"use strict";

module.exports = (function(){

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    //---------------------------------------
    // favoriteSchema
    //---------------------------------------
    var favoriteSchema = new Schema({
            postedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            dishes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dish'}],
        },
        {
            timestamps: true
        });


    //-------------------------------------
    // Create the model
    //-------------------------------------
    var model = mongoose.model('Favorite', favoriteSchema);
    return model;
})();
