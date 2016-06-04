var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-3');
// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    // we're connected!
    console.log("Connected correctly to server");

    // create a new dish
    Dishes.create({
        name: 'Uthapizza',
        description: 'Test',
        comments: [
            {
                rating: 3,
                comment: 'This is insane',
                author: 'Matt Daemon'
            }
        ]
    }, function (err, dish) {
        if (err) {
            console.log("Error saving dish: ", err.message );
            db.close();
        }
        else {
            console.log('Dish created!');
            console.log(dish);

            var id = dish._id;

            console.log("Dishes:");
            console.log(Dishes);
            console.log("-------------------------");
            console.log("db.collection('dishes'):");
            console.log(db.collection('dishes'));
            console.log("-------------------------");

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

                            db.collection('dishes').drop(function () {
                                db.close();
                            });
                        });


                    });
            }, 3000);

        }
     });
});