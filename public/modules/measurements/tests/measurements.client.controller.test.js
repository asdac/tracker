'use strict';

(function() {
	// Measurements Controller Spec
	describe('Measurements Controller Tests', function() {
		// Initialize global variables
		var MeasurementsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Measurements controller.
			MeasurementsController = $controller('MeasurementsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Measurement object fetched from XHR', inject(function(Measurements) {
			// Create sample Measurement using the Measurements service
			var sampleMeasurement = new Measurements({
				name: 'New Measurement'
			});

			// Create a sample Measurements array that includes the new Measurement
			var sampleMeasurements = [sampleMeasurement];

			// Set GET response
			$httpBackend.expectGET('measurements').respond(sampleMeasurements);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.measurements).toEqualData(sampleMeasurements);
		}));

		it('$scope.findOne() should create an array with one Measurement object fetched from XHR using a measurementId URL parameter', inject(function(Measurements) {
			// Define a sample Measurement object
			var sampleMeasurement = new Measurements({
				name: 'New Measurement'
			});

			// Set the URL parameter
			$stateParams.measurementId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/measurements\/([0-9a-fA-F]{24})$/).respond(sampleMeasurement);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.measurement).toEqualData(sampleMeasurement);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Measurements) {
			// Create a sample Measurement object
			var sampleMeasurementPostData = new Measurements({
				name: 'New Measurement'
			});

			// Create a sample Measurement response
			var sampleMeasurementResponse = new Measurements({
				_id: '525cf20451979dea2c000001',
				name: 'New Measurement'
			});

			// Fixture mock form input values
			scope.name = 'New Measurement';

			// Set POST response
			$httpBackend.expectPOST('measurements', sampleMeasurementPostData).respond(sampleMeasurementResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Measurement was created
			expect($location.path()).toBe('/measurements/' + sampleMeasurementResponse._id);
		}));

		it('$scope.update() should update a valid Measurement', inject(function(Measurements) {
			// Define a sample Measurement put data
			var sampleMeasurementPutData = new Measurements({
				_id: '525cf20451979dea2c000001',
				name: 'New Measurement'
			});

			// Mock Measurement in scope
			scope.measurement = sampleMeasurementPutData;

			// Set PUT response
			$httpBackend.expectPUT(/measurements\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/measurements/' + sampleMeasurementPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid measurementId and remove the Measurement from the scope', inject(function(Measurements) {
			// Create new Measurement object
			var sampleMeasurement = new Measurements({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Measurements array and include the Measurement
			scope.measurements = [sampleMeasurement];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/measurements\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMeasurement);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.measurements.length).toBe(0);
		}));
	});
}());