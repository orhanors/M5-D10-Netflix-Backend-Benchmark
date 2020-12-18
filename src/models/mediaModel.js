const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
	Title: { type: String, required: true },
	Year: { type: String, required: true },
	imdbID: { type: String, reqired: true },
	Type: { type: String, required: true },
	Poster: { type: String, required: false },
});

const Media = mongoose.model("media", mediaSchema, "medias");

module.exports = Media;
