var mongoose = require("mongoose");

// Schema Setup
var workoutSchema = new mongoose.Schema({
    workout: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Workout", workoutSchema); 