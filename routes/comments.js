var express = require("express");
var router = express.Router();
var Workout = require("../models/workout");
var Comment = require("../models/comment");

// New - Show form to create a new comment
router.get("/new", isLoggedIn, function(req, res){
    // Find workout by ID
    Workout.findById(req.params.id, function(err, workout){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {workout: workout});
        }
    });
});

// Create - Add new workout to workouts
router.post("/", isLoggedIn, function(req, res){
    // Lookup workout by ID
    Workout.findById(req.params.id, function(err, workout) {
        if(err){
            console.log(err);
            res.redirect("/workouts");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else {
                    workout.comments.push(comment);
                    workout.save();
                    res.redirect('/workouts/' + workout._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;