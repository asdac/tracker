'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var measurements = require('../../app/controllers/measurements.server.controller');

	// Measurements Routes
	app.route('/measurements')
		.get(measurements.list)
		.post(users.requiresLogin, measurements.create);

	app.route('/measurements/:measurementId')
		.get(measurements.read)
		.put(users.requiresLogin, measurements.hasAuthorization, measurements.update)
		.delete(users.requiresLogin, measurements.hasAuthorization, measurements.delete);

	// Finish by binding the Measurement middleware
	app.param('measurementId', measurements.measurementByID);
};
