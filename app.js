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
            res.render("workouts/index", {workouts: allWorkouts});
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
    res.render("workouts/new");
});

// Show - Show more info about the workout
app.get("/workouts/:id", function(req, res) {
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

// ===============
// COMMENTS ROUTES
// ===============

// New - Show form to create a new comment
app.get("/workouts/:id/comments/new", function(req, res){
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
app.post("/workouts/:id/comments", function(req, res){
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
    // Create new comment
    // Connectcomment to workout
    // Redirect to workout page
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});