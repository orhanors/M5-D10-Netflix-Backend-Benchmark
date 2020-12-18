const notFoundError = (err, req, res, next) => {
	if (err.httpStatusCode === 404) {
		res.status(404).send(err.message || "NOT FOUND");
	} else {
		next(err);
	}
};

const badRequestError = (err, req, res, next) => {
	if (err.httpStatusCode === 400) {
		res.status(400).send(err.message || "BAD REQUEST !");
	} else {
		next(err);
	}
};

const unauthorizedError = (err, req, res, next) => {
	if (err.httpStatusCode === 401) {
		res.status(401).send("Unauthorized!");
	}
	next(err);
};

const forbiddenError = (err, req, res, next) => {
	if (err.httpStatusCode === 403) {
		res.status(403).send("Forbidden!");
	}
	next(err);
};

const genericError = (err, req, res, next) => {
	if (!res.headersSent) {
		res.status(err.httpStatusCode || 500).send(err.message);
	}
};

module.exports = {
	notFoundError,
	badRequestError,
	unauthorizedError,
	forbiddenError,
	genericError,
};
