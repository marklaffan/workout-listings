var express = require("express");
var router = express.Router({mergeParams: true});
var Workout = require("../models/workout");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// New - Show form to create a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    // Find workout by ID
    Workout.findById(req.params.id, function(err, workout){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {workout: workout});
        }
    });
});

// Create - Add new comment to workouts
router.post("/", middleware.isLoggedIn, function(req, res){
    // Lookup workout by ID
    Workout.findById(req.params.id, function(err, workout) {
        if(err){
            console.log(err);
            res.redirect("/workouts");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // Add username & ID to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    workout.comments.push(comment);
                    workout.save();
                    req.flash("success", "Your comment has been added.");
                    res.redirect('/workouts/' + workout._id);
                }
            });
        }
    });
});

// Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {workout_id: req.params.id, comment: foundComment});
        }
    });
});


// Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.rediret("back");
        } else {
            req.flash("success", "Comment successfully deleted.");
            res.redirect("/workouts/" + req.params.id);
        }
    });
});

// Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted.");
            res.redirect("/workouts/" + req.params.id);
        }
    });
});

module.exports = router;