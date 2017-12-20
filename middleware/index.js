
var middlewareObj = {};
var Workout = require("../models/workout");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You are going to have to login to do that.");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                // Check if user owns comment
                if(foundComment.author.id.equals(req.user._id)) {     // .equals() - MONGOOSE METHOD
                    next();
                } else {
                    req.flash("error", "YOu do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You are going to have to login to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkWorkoutOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Workout.findById(req.params.id, function(err, foundWorkout){
            if (err || !foundWorkout){
                req.flash("error", "Unable to find Workout");
                res.redirect("back");
            } else {
                // Check if user owns workout
                if(foundWorkout.author.id.equals(req.user._id)) {     // .equals() - MONGOOSE METHOD
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You are going to have to login to do that.");
        res.redirect("back");
    }
};


module.exports = middlewareObj;