var express = require("express");
var router = express.Router({mergeParams: true});
var Workout = require("../models/workout");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
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
            req.flash("success", "Congradulations, your workout has been added to Worklout Listings Ireland.");
            // Redirect back to classes / sessions page
            res.redirect("/workouts");
        }
    });
});


// New - Show form to create a new workout
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("workouts/new");
});

// Show - Show more info about the workout
router.get("/:id", function(req, res) {
    // Find workout by ID
    Workout.findById(req.params.id).populate("comments").exec(function(err, foundWorkout){
        if(err){
            console.log(err);
        } else {
            // Added this block, to check if foundWorkout exists
            if(!foundWorkout) {
                req.flash("error", "Workout not found");
                return res.redirect("back");
            }
            // Render show template with found workout
            res.render("workouts/show", {workout: foundWorkout});
        }
    });
});

// Edit Workout
router.get("/:id/edit", middleware.checkWorkoutOwnership, function(req, res){
    Workout.findById(req.params.id, function(err, foundWorkout) {
        // Added this block, to check if foundWorkout exists
        if(!foundWorkout) {
            req.flash("error", "Workout not found");
            return res.redirect("back");
        }
        if(err) {
            console.log(err);
        } else {
            res.render("workouts/edit", {workout: foundWorkout});
        }
    });
});


// Update Workout
router.put("/:id", middleware.checkWorkoutOwnership, function(req, res){
    // Find & update the correct workout
    Workout.findByIdAndUpdate(req.params.id, req.body.workout, function(err, updatedWorkout){
        // Added this block, to check if foundWorkout exists
        if(!updatedWorkout) {
            req.flash("error", "Workout not found");
            return res.redirect("back");
        }
        if(err){
            res.redirect("/workouts");
        } else {
            req.flash("success", "Your workout has been successfully updated.");
            res.redirect("/workouts/" + req.params.id);
        }
    });
});

// Destroy Workout
router.delete("/:id", middleware.checkWorkoutOwnership, function(req, res){
    Workout.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/workouts");
        } else {
            req.flash("success", "Your workout has been successfully deleted.");
            res.redirect("/workouts");
        }
    });
});

module.exports = router;