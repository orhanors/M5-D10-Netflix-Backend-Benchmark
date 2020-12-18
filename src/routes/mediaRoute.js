//GENERAL REQUIREMENTS
const express = require("express");
const Media = require("../models/mediaModel"); //Media database model
const Joi = require("joi");
const uniqid = require("uniqid");
const axios = require("axios");
//MEDIA UPLOAD/DOWNLOAD REQUIREMENTS
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary, uploads } = require("../connections/cloudinary");
const { response } = require("express");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const sgMail = require("@sendgrid/mail");

const mediaRoute = express.Router();
/**
 * {
        "Title": "The Lord of the Rings: The Fellowship of the Ring",
        "Year": "2001",
        "imdbID": "tt0120737",  //UNIQUE
        "Type": "movie",
        "Poster": "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"
    }
 */

const validateMedia = (dataToValidate) => {
	const schema = Joi.object().keys({
		Title: Joi.string().min(3).max(30).required(),
		Year: Joi.string().min(4).max(4).required(),
		Type: Joi.string().min(2).max(50).required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

// IMAGE UPLOADING
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "strive-netflix",
	},
});

const cloudinaryMulter = multer({ storage: storage });

mediaRoute.post(
	"/:imdbID/upload",
	cloudinaryMulter.single("poster"),
	async (req, res, next) => {
		try {
			const image_path = req.file.path;

			try {
				await Media.update(
					{ imdbID: req.params.imdbID },
					{ Poster: image_path }
				);
				res.send("image uploaded");
			} catch (error) {
				console.log(error);
				next(error);
			}
		} catch (error) {
			console.log(error);
			next(error);
		}
	}
);

mediaRoute.get("/", async (req, res, next) => {
	try {
		try {
			const allMedias = await Media.find({});
			res.send(allMedias);
		} catch (error) {
			console.log("ERROR! Database get method failed", error);
			next(error);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

//GET movie from OMDB
mediaRoute.get("/:imdbID", async (req, res, next) => {
	try {
		const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=`;
		const response = await axios.get(url + req.params.imdbID);
		const data = await response.data;
		if (data) {
			res.send(data);
		} else {
			const err = new Error();
			err.httpStatusCode = 404;
			next(err);
		}
	} catch (error) {
		console.log("ERROR! Getting movie by id error", error);
		next(error);
	}
});

//GET PDF file
mediaRoute.get("/catalogue/pdf", async (req, res, next) => {
	try {
		const url = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=`;

		if (!req.query.title) {
			res.status(400).send(
				"Response should contain title query parameter"
			);
		} else {
			const response = await axios.get(url + req.query.title);
			const data = await response.data;
			console.log(data);

			res.status(200).send(data);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

mediaRoute.post("/", async (req, res, next) => {
	//TODO make imdbID
	try {
		const { error } = validateMedia(req.body);

		if (error) {
			const err = new Error();
			err.httpStatusCode = 400;
			err.message = error.details[0].message;
			next(err);
		} else {
			const newMovie = new Media({ ...req.body, imdbID: uniqid() });

			try {
				await newMovie.save();
				res.send(newMovie);
			} catch (error) {
				console.log(error);
				next(error);
			}
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

mediaRoute.delete("/:movieId", async (req, res, next) => {
	try {
		const result = await Media.findByIdAndRemove(req.params.movieId);
	} catch (error) {
		console.log(error);
		next(error);
	}
});

const sendEmail = async (toEmail, body) => {
	try {
		console.log("stuffs working....");
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);

		const msg = {
			to: toEmail,
			from: "orsorhan1@gmail.com",
			subject: "Strive sendgrid e-mail",
			text: "Your catoluge movie",

			html: `<p>${body}</p>`,
		};

		const result = await sgMail.send(msg);

		console.log("sendgrid result is ", result);
	} catch (error) {
		console.log("Email error is", error);
	}
};

mediaRoute.post("/mail/sendCatalogue", async (req, res, next) => {
	try {
		const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=`;

		if (!req.query.title) {
			res.status(400).send(
				"Response should contain title query parameter"
			);
		} else {
			const response = await axios.get(url + req.query.title);
			const data = await response.data;
			await sendEmail(req.query.email, JSON.stringify(data));

			res.status(200).send("Mail Sent");
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});
module.exports = mediaRoute;
