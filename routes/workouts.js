var express = require("express");
var router = express.Router({mergeParams: true});
var Workout = require("../models/workout");

// Index - show all workouts
router.get("/", function(req, res){
    // Fetch all workouts from DB
    Workout.find({}, function(err, allWorkouts){
        if(err) {
            console.log(err);
        } else {
            res.render("workouts/index", {workouts: allWorkouts, currentUser: req.user});
        }
    });
});

// Create - Add new workout to workouts
router.post("/", function(req, res){
    // Get data from form & add to sessions array
    var workout = req.body.workout;
    var image = req.body.image;
    var desc = req.body.description;
    var newWorkout = {workout: workout, image: image, description: desc};
    // Create a new workout and save to DB
    Workout.create(newWorkout, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // Redirect back to classes / sessions page
            res.redirect("/workouts");
        }
    });
});


// New - Show form to create a new workout
router.get("/new", function(req, res){
    res.render("workouts/new");
});

// Show - Show more info about the workout
router.get("/:id", function(req, res) {
    // Find workout by ID
    Workout.findById(req.params.id).populate("comments").exec(function(err, foundWorkout){
        if(err){
            console.log(err);
        } else {
            // Render show template with found workout
            res.render("workouts/show", {workout: foundWorkout});
        }
    });
});

module.exports = router;