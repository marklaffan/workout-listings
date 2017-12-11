var express = require("express");
var app = express();

app.set("view engine", "ejs");



app.get("/", function(req, res){
    res.render("landing");
});

app.get("/sessions", function(req, res){
    var sessions = [
        {class_name: "Kettlebells", trainer: "Brian Byrne", image: "https://cdn.pixabay.com/photo/2017/02/09/16/29/kettlebell-2052775__340.jpg"},
        {class_name: "Yoga", trainer: "Deberah Kane", image: "https://cdn.pixabay.com/photo/2017/08/01/22/44/people-2568410__340.jpg"},
        {class_name: "TRX", trainer: "Leo Micheal", image: "https://cdn.pixabay.com/photo/2016/01/13/22/36/climbing-1139016__340.jpg"},
        {class_name: "Pilates", trainer: "Susan Burnell", image: "https://cdn.pixabay.com/photo/2017/01/03/07/52/weights-1948813__340.jpg"}
    ];

    res.render("sessions", {sessions: sessions});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Workout Listings Server is up and running");
});