var mongoose = require('mongoose'),
    assert = require('assert');

var Dishes = require('./models/dishes-1');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new user
    var newDish = Dishes({
        name: 'Uthapizza',
        description: 'Test'
    });

    // save the user
    newDish.save(function (err) {
        if (err) {
            console.log("Error saving dish", err.message);
            //throw err;
        }
        else {
            console.log('Dish created!');
        }

        // get all the users
        Dishes.find({}, function (err, dishes) {
            if (err) throw err;

            // object of all the users
            console.log("Dishes: ");
            console.log(dishes);
            console.log("----------------");
            db.collection('dishes').drop(function () {
                console.log("dropped dishes");
                db.close();
            });
        });
    });
});