'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Measurement = mongoose.model('Measurement'),
	_ = require('lodash');

/**
 * Create a Measurement
 */
exports.create = function(req, res) {
	var measurement = new Measurement(req.body);
	measurement.user = req.user;

	measurement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(measurement);
		}
	});
};

/**
 * Show the current Measurement
 */
exports.read = function(req, res) {
	res.jsonp(req.measurement);
};

/**
 * Update a Measurement
 */
exports.update = function(req, res) {
	var measurement = req.measurement ;

	measurement = _.extend(measurement , req.body);

	measurement.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(measurement);
		}
	});
};

/**
 * Delete an Measurement
 */
exports.delete = function(req, res) {
	var measurement = req.measurement ;

	measurement.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(measurement);
		}
	});
};

/**
 * List of Measurements
 */
exports.list = function(req, res) {
	Measurement.find().where('user', req.query.user).sort('-taken').exec(function(err, measurements) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(measurements);
		}
	});
};

/**
 * Measurement middleware
 */
exports.measurementByID = function(req, res, next, id) { 
	Measurement.findById(id).populate('user', 'displayName').exec(function(err, measurement) {
		if (err) return next(err);
		if (! measurement) return next(new Error('Failed to load Measurement ' + id));
		req.measurement = measurement ;
		next();
	});
};

/**
 * Measurement authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.measurement.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
