
var middlewareObj = {};
var Workout = require("../models/workout");
var Comment = require("../models/comment");

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect("back");
            } else {
                // Check if user owns comment
                if(foundComment.author.id.equals(req.user._id)) {     // .equals() - MONGOOSE METHOD
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkWorkoutOwnership = function(req, res, next){
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
};


module.exports = middlewareObj;