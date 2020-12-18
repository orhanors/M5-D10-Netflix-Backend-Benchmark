const express = require("express");
const mongoose = require("mongoose");
const mediaRoute = require("./routes/mediaRoute");
const reviewRoute = require("./routes/reviewRoute");
const {
	notFoundError,
	badRequestError,
	forbiddenError,
	unauthorizedError,
	genericError,
} = require("./errorHandling");
const server = express();

const port = process.env.PORT || 3001;
const mongo_uri = process.env.MONGO_URI;

//DATABASE CONNECTION
mongoose
	.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to database..."))
	.catch((err) => console.log(err));

//MIDDLEWARES
server.use(express.json());

//ROUTES
server.use("/media", mediaRoute);
server.use("/media", reviewRoute);
//ERROR HANDLING MIDDLEWARES
server.use(badRequestError);
server.use(notFoundError);
server.use(forbiddenError);
server.use(unauthorizedError);
server.use(genericError);

server.listen(port, () => {
	if (server.get("env") !== "production") {
		console.log("Server is running LOCALLY on port:", port);
	} else {
		console.log("Server is running CLOUD on port:", port);
	}
});
