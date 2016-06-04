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
// promoSchema
//---------------------------------------
    var promoSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String
        },
        label: {
            type: String,
            default: ''
        },
        price: {
            type: Currency,
            required: true  // There are no free promotions...
        },
        description: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    });

//-------------------------------------
// Create the model
//-------------------------------------
    var Promotions = mongoose.model('Promotion', promoSchema);

    return Promotions;
})();
