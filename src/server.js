const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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

const whitelist = process.env.CORS_WHITELIST;

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
};

//DATABASE CONNECTION
mongoose
	.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to database..."))
	.catch((err) => console.log(err));

//MIDDLEWARES
server.use(express.json());
server.use(cors(corsOptions));
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
