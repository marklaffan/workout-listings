var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Workout     = require("./models/workout"),
    Comment     = require("./models/comment"),
    seedDB      = require("./seeds");


mongoose.connect("mongodb://localhost/workout_listings", {useMongoClient: true}); // useMongoClient: true removes warning on starting server
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


app.get("/", function(req, res){
    res.render("landing");
});

// Index - show all workouts
app.get("/workouts", function(req, res){
    // Fetch all workouts from DB
    Workout.find({}, function(err, allWorkouts){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {workouts: allWorkouts});
        }
    });
});

// Create - Add new workout to workouts
app.post("/workouts", function(req, res){
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
app.get("/workouts/new", function(req, res){
    res.render("new.ejs");
});

// Show - Show more info about the workout
app.get("/workouts/:id", function(req, res) {
    // Find workout by ID
    Workout.findById(req.params.id).populate("comments").exec(function(err, foundWorkout){
        if(err){
            console.log(err);
        } else {
            // Render show template with found workout
            res.render("show", {workout: foundWorkout});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});