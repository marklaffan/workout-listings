var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/workout_listings");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup
var workoutSchema = new mongoose.Schema({
    class_name: String,
    image: String
});

var sessions = [
        {class_name: "Kettlebells", image: "https://cdn.pixabay.com/photo/2017/02/09/16/29/kettlebell-2052775__340.jpg"},
        {class_name: "Yoga", image: "https://cdn.pixabay.com/photo/2017/08/01/22/44/people-2568410__340.jpg"},
        {class_name: "TRX", image: "https://cdn.pixabay.com/photo/2016/01/13/22/36/climbing-1139016__340.jpg"},
        {class_name: "Pilates", image: "https://cdn.pixabay.com/photo/2017/01/03/07/52/weights-1948813__340.jpg"}
    ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/sessions", function(req, res){
    res.render("sessions", {sessions: sessions});
});

app.post("/sessions", function(req, res){
    // Get data from form & add to sessions array
    var class_name = req.body.class_name;
    var image = req.body.image;
    var newSession = {class_name: class_name, image: image};
    sessions.push(newSession);
    // Redirect back to classes / sessions page
    res.redirect("/sessions");
});

app.get("/sessions/new", function(req, res){
    res.render("new.ejs");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});