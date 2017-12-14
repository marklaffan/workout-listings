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

var Workout = mongoose.model("Workout", workoutSchema); 

// Workout.create(
//     {
//         workout: "Pilates", image: "https://cdn.pixabay.com/photo/2017/01/03/07/52/weights-1948813__340.jpg"
//     }, function(err, workout){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("Newly created workout: ");
//             console.log(workout);
//         }
//     });


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/workouts", function(req, res){
    // Fetch all workouts from DB
    Workout.find({}, function(err, allWorkouts){
        if(err) {
            console.log(err);
        } else {
            res.render("workouts", {workouts: allWorkouts});
        }
    });
});

app.post("/workouts", function(req, res){
    // Get data from form & add to sessions array
    var workout = req.body.workout;
    var image = req.body.image;
    var newWorkout = {workout: workout, image: image};
    // Create a new workout and save to DB
    Workout.create(newWorkout, function(err, newlyCreated) {
        if(err) {
            console.log(err);
        } else {
            // Redirect back to classes / sessions page
            res.redirect("/workouts");
        }
    })
    
});

app.get("/workouts/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});