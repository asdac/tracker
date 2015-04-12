'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Measurement Schema
 */
var MeasurementSchema = new Schema({
	weight: {
		type: Number
	},
	bicep: {
		type: Number
	},
	quads: {
		type: Number
	},
	calf: {
		type: Number
	},
	waist: {
		type: Number
	},
	chest: {
		type: Number
	},
	created: {
		type: Date,
		default: Date.now
	},
	taken: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Measurement', MeasurementSchema);
