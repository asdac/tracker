'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Measurement = mongoose.model('Measurement'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, measurement;

/**
 * Measurement routes tests
 */
describe('Measurement CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Measurement
		user.save(function() {
			measurement = {
				name: 'Measurement Name'
			};

			done();
		});
	});

	it('should be able to save Measurement instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Measurement
				agent.post('/measurements')
					.send(measurement)
					.expect(200)
					.end(function(measurementSaveErr, measurementSaveRes) {
						// Handle Measurement save error
						if (measurementSaveErr) done(measurementSaveErr);

						// Get a list of Measurements
						agent.get('/measurements')
							.end(function(measurementsGetErr, measurementsGetRes) {
								// Handle Measurement save error
								if (measurementsGetErr) done(measurementsGetErr);

								// Get Measurements list
								var measurements = measurementsGetRes.body;

								// Set assertions
								(measurements[0].user._id).should.equal(userId);
								(measurements[0].name).should.match('Measurement Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Measurement instance if not logged in', function(done) {
		agent.post('/measurements')
			.send(measurement)
			.expect(401)
			.end(function(measurementSaveErr, measurementSaveRes) {
				// Call the assertion callback
				done(measurementSaveErr);
			});
	});

	it('should not be able to save Measurement instance if no name is provided', function(done) {
		// Invalidate name field
		measurement.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Measurement
				agent.post('/measurements')
					.send(measurement)
					.expect(400)
					.end(function(measurementSaveErr, measurementSaveRes) {
						// Set message assertion
						(measurementSaveRes.body.message).should.match('Please fill Measurement name');
						
						// Handle Measurement save error
						done(measurementSaveErr);
					});
			});
	});

	it('should be able to update Measurement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Measurement
				agent.post('/measurements')
					.send(measurement)
					.expect(200)
					.end(function(measurementSaveErr, measurementSaveRes) {
						// Handle Measurement save error
						if (measurementSaveErr) done(measurementSaveErr);

						// Update Measurement name
						measurement.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Measurement
						agent.put('/measurements/' + measurementSaveRes.body._id)
							.send(measurement)
							.expect(200)
							.end(function(measurementUpdateErr, measurementUpdateRes) {
								// Handle Measurement update error
								if (measurementUpdateErr) done(measurementUpdateErr);

								// Set assertions
								(measurementUpdateRes.body._id).should.equal(measurementSaveRes.body._id);
								(measurementUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Measurements if not signed in', function(done) {
		// Create new Measurement model instance
		var measurementObj = new Measurement(measurement);

		// Save the Measurement
		measurementObj.save(function() {
			// Request Measurements
			request(app).get('/measurements')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Measurement if not signed in', function(done) {
		// Create new Measurement model instance
		var measurementObj = new Measurement(measurement);

		// Save the Measurement
		measurementObj.save(function() {
			request(app).get('/measurements/' + measurementObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', measurement.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Measurement instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Measurement
				agent.post('/measurements')
					.send(measurement)
					.expect(200)
					.end(function(measurementSaveErr, measurementSaveRes) {
						// Handle Measurement save error
						if (measurementSaveErr) done(measurementSaveErr);

						// Delete existing Measurement
						agent.delete('/measurements/' + measurementSaveRes.body._id)
							.send(measurement)
							.expect(200)
							.end(function(measurementDeleteErr, measurementDeleteRes) {
								// Handle Measurement error error
								if (measurementDeleteErr) done(measurementDeleteErr);

								// Set assertions
								(measurementDeleteRes.body._id).should.equal(measurementSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Measurement instance if not signed in', function(done) {
		// Set Measurement user 
		measurement.user = user;

		// Create new Measurement model instance
		var measurementObj = new Measurement(measurement);

		// Save the Measurement
		measurementObj.save(function() {
			// Try deleting Measurement
			request(app).delete('/measurements/' + measurementObj._id)
			.expect(401)
			.end(function(measurementDeleteErr, measurementDeleteRes) {
				// Set message assertion
				(measurementDeleteRes.body.message).should.match('User is not logged in');

				// Handle Measurement error error
				done(measurementDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Measurement.remove().exec(function(){
				done();
			});	
		});
	});
});
