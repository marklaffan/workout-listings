var express     = require("express"),
    app         = express(),
    passport    = require("passport"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Workout     = require("./models/workout"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    // passportLocalMongoose   = require("passport-local-mongoose"),
    seedDB      = require("./seeds");
    
var commentRoutes   = require("./routes/comments"),
    workoutRoutes   = require("./routes/workouts"),
    indexRoutes   = require("./routes/index");


mongoose.connect("mongodb://localhost/workout_listings", {useMongoClient: true}); // useMongoClient: true removes warning on starting server
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();  // Seed the DB

// Passport Config
app.use(require("express-session")({
    secret: "Mark is a Golden God",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/workouts/:id/comments", commentRoutes);
app.use("/workouts", workoutRoutes);

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.get("/", function(req, res){
    res.render("landing");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});