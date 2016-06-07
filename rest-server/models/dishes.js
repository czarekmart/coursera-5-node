"use strict";

module.exports = (function(){

    // grab the things we need
    var mongoose = require('mongoose');

//------------------------------------------
// Load custom Currency type plugin
//-------------------------------------------
    require('mongoose-currency').loadType(mongoose);
    var Currency = mongoose.Types.Currency;

    var Schema = mongoose.Schema;

//---------------------------------------
// commentSchema
//---------------------------------------
    var commentSchema = new Schema({
            rating: {
                type: Number,
                min: 1,
                max: 5,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
        },
        {
            timestamps: true
        });

//---------------------------------------
// dishSchema
//---------------------------------------
    var dishSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String
        },
        category: {
            type: String
        },
        label: {
            type: String,
            default: ''
        },
        price: {
            type: Currency,
            required: true  // There are no free dishes...
        },
        description: {
            type: String,
            required: true
        },
        comments: [commentSchema]
    }, {
        timestamps: true
    });

//-------------------------------------
// Create the model
//-------------------------------------
    var Dishes = mongoose.model('Dish', dishSchema);

    Dishes.cloneComment = function(fromComment, toComment) {
        var comment = {
            rating: toComment.rating,
            comment: toComment.comment,
            author : toComment.author
        };
        if ( fromComment.rating ) {
            comment.rating = fromComment.rating;
        }
        if (fromComment.comment) {
            comment.comment = fromComment.comment;
        }
        if (fromComment.author) {
            comment.author = fromComment.author;
        }
        return comment;
    }

    return Dishes;
})();
