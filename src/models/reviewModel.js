const mongoose = require("mongoose");

// {
//     "_id": "123455", //SERVER GENERATED
//     "comment": "A good book but definitely I don't like many parts of the plot", //REQUIRED
//     "rate": 3, //REQUIRED, max 5
//     "elementId": "5d318e1a8541744830bef139", //REQUIRED = IMDBID
//     "createdAt": "2019-08-01T12:46:45.895Z" // SERVER GENERATED
// }

const reviewSchema = new mongoose.Schema({
	comment: { type: String, required: true },
	rate: { type: Number, required: true, min: 1, max: 5 },
	elementId: { type: String, required: true },
	createdAt: { type: Date },
});

const Review = mongoose.model("review", reviewSchema, "reviews");

module.exports = Review;
