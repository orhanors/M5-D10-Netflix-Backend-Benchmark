const express = require("express");

const Joi = require("joi");
const reviewRouter = express.Router();
const Review = require("../models/reviewModel");

/**
 *  POST /books/id/comments => adds a comment for book {id}
    GET /books/id/comments => gets all the comments for book {id}
    DELETE /books/comments/id => delete comment {id}
 */

const validateReview = (dataToValidate) => {
	const schema = Joi.object().keys({
		comment: Joi.string().min(3).max(500).required(),
		rate: Joi.number().integer().min(1).max(5).required(),
	});

	console.log(schema.validate(dataToValidate));
	return schema.validate(dataToValidate);
};

reviewRouter.post("/:imdbID/reviews", async (req, res, next) => {
	try {
		const { error } = validateReview(req.body);
		if (error) {
			// İf there is an error joi returns an error object which is not empty, otherwise it will be empty
			const err = new Error();
			err.message = error.details[0].message; //it returns the error message from Joi validation
			err.httpStatusCode = 400;
			next(err);

			//TODO add else if valitadion for id checking
		} else {
			const review = new Review({
				...req.body,
				elementId: req.params.imdbID,
				createdAt: new Date(),
			});

			try {
				const result = await review.save();
				res.status(201).send(review);
				console.log(result);
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

reviewRouter.get("/:imdbID/reviews", async (req, res, next) => {
	try {
		const movieComments = await Review.find({
			elementId: req.params.imdbID,
		});

		if (movieComments) {
			res.status(200).send(movieComments);
		} else {
			const err = new Error();
			err.httpStatusCode = 404;
			next(err);
		}
	} catch (error) {
		console.log(error);
		next(error);
	}
});

reviewRouter.delete("/reviews/:reviewId", async (req, res, next) => {
	try {
		const comment = await Review.find({ _id: req.params.reviewId });

		if (!comment) {
			const err = new Error();
			err.httpStatusCode = 404;
			next(err);
		} else {
			try {
				const result = await Review.findByIdAndRemove(
					req.params.reviewId
				);
				res.send(200).send(
					`successfuly deleted... id:${req.params.reviewId}`
				);
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
module.exports = reviewRouter;
