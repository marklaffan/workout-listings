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
router.post("/", isLoggedIn, function(req, res){
    // Get data from form & add to sessions array
    var workout = req.body.workout;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newWorkout = {workout: workout, image: image, description: desc, author: author};
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
router.get("/new", isLoggedIn, function(req, res){
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

// Edit Workout
router.get("/:id/edit", checkWorkoutOwnership, function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout) {
        res.render("workouts/edit", {workout: foundWorkout});
    });
});


// Update Workout
router.put("/:id", checkWorkoutOwnership, function(req, res){
    // Find & update the correct workout
    Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedWorkout){
        if(err){
            res.redirect("/workouts");
        } else {
            res.redirect("/workouts/" + req.params.id);
        }
    });
});

// Destroy Workout
router.delete("/:id", checkWorkoutOwnership, function(req, res){
    Workout.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/workouts");
        } else {
            res.redirect("/workouts");
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Middleware
function checkWorkoutOwnership(req, res, next){
    if(req.isAuthenticated()){
        Workout.findById(req.params.id, function(err, foundWorkout){
            if (err){
                res.redirect("back");
            } else {
                // Check if user owns workout
                if(foundWorkout.author.id.equals(req.user._id)) {     // .equals() - MONGOOSE METHOD
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;