var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// Show Sign up form
router.get("/register", function(req, res){
   res.render("register"); 
});

// Sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Workout Listings Ireland " + user.username);
            res.redirect("/workouts");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// Login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/workouts",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Logout route
router.get("/logout", function(req, res){
   req.logout(); 
   req.flash("success", "You are logged out!");
   res.redirect("/workouts");
});

module.exports = router;