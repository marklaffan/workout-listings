var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/workout_listings");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup
var workoutSchema = new mongoose.Schema({
    workout: String,
    image: String
});

var workouts = [
        {workout: "Kettlebells", image: "https://cdn.pixabay.com/photo/2017/02/09/16/29/kettlebell-2052775__340.jpg"},
        {workout: "Yoga", image: "https://cdn.pixabay.com/photo/2017/08/01/22/44/people-2568410__340.jpg"},
        {workout: "TRX", image: "https://cdn.pixabay.com/photo/2016/01/13/22/36/climbing-1139016__340.jpg"},
        {workout: "Pilates", image: "https://cdn.pixabay.com/photo/2017/01/03/07/52/weights-1948813__340.jpg"}
    ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/workouts", function(req, res){
    res.render("workouts", {workouts: workouts});
});

app.post("/workouts", function(req, res){
    // Get data from form & add to sessions array
    var workout = req.body.workout;
    var image = req.body.image;
    var newWorkout = {workout: workout, image: image};
    workouts.push(newWorkout);
    // Redirect back to classes / sessions page
    res.redirect("/workouts");
});

app.get("/workouts/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});