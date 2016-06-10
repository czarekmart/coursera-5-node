var mongoose = require('mongoose'),
    assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var terminateCollection = function(collectionName, next) {
    console.log("Dropping collection '" + collectionName + "'");
    db.collection(collectionName).drop(function() {
        console.log("Dropped collection '" + collectionName + "'");
        if(next) {
            next();
        }
    });
};

//-----------------------------------------------------------------
// Test Dishes
//-----------------------------------------------------------------
var testDishes = function(next) {
    "use strict";

    var Dishes = require('./models/dishes');

    // we're connected!
    console.log("Dishes connected to server");

    // create a new dish
    Dishes.create({
        "name": "Uthapizza",
        "image": "images/uthapizza.png",
        "category": "mains",
        "label": "Hot",
        "price": "4.99",
        "description": "A unique combination of Indian Uthappam (pancake) and Italian pizza.",
        comments: [
            {
                rating: 3,
                comment: 'This is insane',
                author: 'Matt Daemon'
            }
        ]
    }, function (err, dish) {
        if (err) {
            console.log("Error saving dish: ", err.message);
            terminateCollection('dishes', next);
        }
        else {
            console.log('Dish created!');
            console.log(dish);

            var id = dish._id;

            // get all the dishes
            setTimeout(function () {
                Dishes.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                    .exec(function (err, dish) {
                        if (err) throw err;
                        console.log('Updated Dish!');
                        console.log(dish);

                        dish.comments.push({
                            rating: 5,
                            comment: 'I\'m getting a sinking feeling!',
                            author: 'Leonardo di Carpaccio'
                        });

                        dish.save(function (err, dish) {
                            "use strict";

                            console.log('Updated Comments!');
                            console.log(dish);
                            terminateCollection('dishes', next);
                        });


                    });
            }, 1500);

        }
    });

};

//-----------------------------------------------------------------
// Test Promotions
//-----------------------------------------------------------------
var testPromotions = function (next) {
    "use strict";

    var Promotions = require('./models/promotions');

    // we're connected!
    console.log("Promotions connected to server");

    // create a new promotions
    Promotions.create(
        {
            "name": "Weekend Grand Buffet",
            "image": "images/buffet.png",
            "label": "New",
            "price": "19.99",
            "description": "Featuring mouthwatering combinations with a choice of five different salads. All for just $19.99 per person!"
        },
        function (err, promo) {
        if (err) {
            console.log("Error saving promotion: ", err.message);
            terminateCollection('promotions', next);
        }
        else {
            console.log('Promotion created!');
            console.log(promo);

            var id = promo._id;

            // get all the promotions
            setTimeout(function () {
                Promotions.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated promotion description!'
                    }
                }, {
                    new: true
                })
                    .exec(function (err, promo) {
                        if (err) throw err;
                        console.log('Updated Promotion!');
                        console.log(promo);
                        terminateCollection('promotions', next);
                    });
            }, 1500);

        }
    });

};

//-----------------------------------------------------------------
// Test Leaders
//-----------------------------------------------------------------
var testLeaders = function (next) {
    "use strict";

    var Leaders = require('./models/leadership');

    // we're connected!
    console.log("Leadership connected to server");

    // create a new leader
    Leaders.create(
        {
            "name": "Peter Pan",
            "image": "images/alberto.png",
            "designation": "Chief Epicurious Officer",
            "abbr": "CEO",
            "description": "Our CEO, Peter, credits his hardworking East Asian immigrant parents who undertook the arduous journey",
        },
        function (err, leader) {
            if (err) {
                console.log("Error saving leader: ", err.message);
                terminateCollection('leaders', next);
            }
            else {
                console.log('Leader created!');
                console.log(leader);

                var id = leader._id;

                // get all the leaders
                setTimeout(function () {
                    Leaders.findByIdAndUpdate(id, {
                        $set: {
                            description: 'Updated leader description!'
                        }
                    }, {
                        new: true
                    })
                        .exec(function (err, leader) {
                            if (err) throw err;
                            console.log('Updated Leader!');
                            console.log(leader);
                            terminateCollection('leaders', next);
                        });
                }, 1500);

            }
        });

};

//-----------------------------------------------
// Call the tests
//-----------------------------------------------
db.once('open', function () {
    testDishes(function() {
        testPromotions(function() {
            testLeaders(function(){
                console.log("Closing connection...");
                db.close();
            });
        })
    });
});