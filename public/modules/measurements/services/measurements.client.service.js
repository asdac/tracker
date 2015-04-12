'use strict';

//Measurements service used to communicate Measurements REST endpoints
angular.module('measurements')

	.factory('Measurements', ['$resource',
		function($resource) {
			return $resource('measurements/:measurementId', { measurementId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])


	.factory('Notify', ['$rootScope',
		function($rootScope) {
			var notify = {};

			notify.sendMsg = function(msg, data) {
				data = data || {};
				$rootScope.$emit(msg, data);
			};

			notify.getMsg = function(msg, func, scope){
				var unbind = $rootScope.$on(msg, func) ;
				if(scope) {
					scope.$on('destroy', unbind);
				}
			};
			return notify;
		}
	]);
