'use strict';

var measurementsApp = angular.module('measurements');

// Measurements controller
measurementsApp.controller('MeasurementsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Measurements', '$log', 'Notify',
	function($scope, $stateParams, $location, Authentication, Measurements, $log, Notify) {
		$scope.authentication = Authentication;

		// Find a list of Measurements matching user id
		Measurements.query({user:$scope.authentication.user._id}).$promise.then( function(measurements) {
			$scope.measurements = measurements;
			$scope.exampleData = [
				{
					'key': 'Biceps',
					'values': []
				}];
			for (var i = 0; i < measurements.length; i++) {
				var measurement = measurements[i];
				$scope.exampleData[0].values.push([(new Date(measurement.taken)).setHours(0,0,0,0), measurement.bicep]);
			}
		});

		this.xAxisTickFormatFunction = function(){
			return function(d){
				return d3.time.format('%e/%m/%y')(new Date(d)); //uncomment for date format
			};
		};

		this.update = function(updatedMeasurement) {
			var measurement = updatedMeasurement;
			measurement.$update(function() {
				Notify.sendMsg('NewMeasurement', {'id': measurement._id});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		this.addMeasurement = function() {
			this.inserted = new Measurements({
				bicep:0,
				chest:0,
				waist:0,
				quads:0,
				calf:0,
				weight:0
			});
			this.inserted.$save(function (response) {
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.measurements.push(this.inserted);
			Notify.sendMsg('NewMeasurement', {'id': this.inserted._id});
		};

		// Remove existing Measurement
		this.remove = function(measurement) {
			if ( measurement ) {
				measurement.$remove();

				for (var i in $scope.measurements) {
					if ($scope.measurements [i] === measurement) {
						$scope.measurements.splice(i, 1);
					}
				}
				Notify.sendMsg('NewMeasurement', {'id': measurement._id});
			} else {
				this.measurement.$remove(function() {
				});
			}
		};
	}
]);

measurementsApp.directive('chart', ['Measurements','Notify', '$log',function(Measurements, Notify, $log) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/measurements/views/chart-template.html',
		link: function(scope, element, attrs) {
			Notify.getMsg('NewMeasurement', function(event, data){
				Measurements.query({user:scope.authentication.user._id}).$promise.then( function(measurements) {
					scope.measurements = measurements;
					scope.exampleData = [
						{
							'key': 'Biceps',
							'values': []
						}];
					for (var i = 0; i < measurements.length; i++) {
						var measurement = measurements[i];
						scope.exampleData[0].values.push([(new Date(measurement.taken)).setHours(0,0,0,0), measurement.bicep]);
					}

				});
			});
		}
	};
}]);
