'use strict';

//Setting up route
angular.module('measurements').config(['$stateProvider',
	function($stateProvider) {
		// Measurements state routing
		$stateProvider.
		state('listMeasurements', {
			url: '/measurements',
			templateUrl: 'modules/measurements/views/list-measurements.client.view.html'
		});
	}
]);
