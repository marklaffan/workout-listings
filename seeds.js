var mongoose = require("mongoose");
var Workout = require("./models/workout");
var Comment = require("./models/comment");

var data = [
        {
            workout: "Kettlebells", 
            image: "https://cdn.pixabay.com/photo/2017/02/09/16/29/kettlebell-2052775__340.jpg",
            description: "Integer dapibus risus at nunc cursus pellentesque. Proin a ullamcorper tellus, et ornare augue. Nam ullamcorper vehicula eros sed aliquet. Praesent suscipit nunc sed eros pharetra porttitor. Vestibulum condimentum mattis aliquam. Vivamus auctor, orci sed fermentum interdum, leo tellus laoreet orci, sit amet finibus augue libero id diam. Cras non convallis dolor. In mattis felis vitae nisi ultrices congue. Donec dictum risus in tortor viverra convallis."
        },
        {
            workout: "Yoga", 
            image: "https://cdn.pixabay.com/photo/2017/08/01/22/44/people-2568410__340.jpg",
            description: "Integer dapibus risus at nunc cursus pellentesque. Proin a ullamcorper tellus, et ornare augue. Nam ullamcorper vehicula eros sed aliquet. Praesent suscipit nunc sed eros pharetra porttitor. Vestibulum condimentum mattis aliquam. Vivamus auctor, orci sed fermentum interdum, leo tellus laoreet orci, sit amet finibus augue libero id diam. Cras non convallis dolor. In mattis felis vitae nisi ultrices congue. Donec dictum risus in tortor viverra convallis."
        },
        {
            workout: "Circuit Training", 
            image: "https://cdn.pixabay.com/photo/2017/07/02/19/24/dumbbells-2465478__340.jpg",
            description: "Integer dapibus risus at nunc cursus pellentesque. Proin a ullamcorper tellus, et ornare augue. Nam ullamcorper vehicula eros sed aliquet. Praesent suscipit nunc sed eros pharetra porttitor. Vestibulum condimentum mattis aliquam. Vivamus auctor, orci sed fermentum interdum, leo tellus laoreet orci, sit amet finibus augue libero id diam. Cras non convallis dolor. In mattis felis vitae nisi ultrices congue. Donec dictum risus in tortor viverra convallis."
        }
    ]
function seedDB() {
    // Remove any workouts
    Workout.remove({}, function(err){
        if(err){
            console.log(err);
        } 
        console.log("Remove workouts");
        // Add a few workouts
        data.forEach(function(seed) {
            Workout.create(seed, function(err, workout) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Added a workout");
                    // Add a few comments
                    Comment.create(
                        {
                            text: "Good class, trainer was very helpful.", 
                            author: "Homer"
                        }, function(err, comment) {
                            if(err) {
                                console.log(err);
                            } else {
                                workout.comments.push(comment);
                                workout.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
    
    
}

    

module.exports = seedDB; 