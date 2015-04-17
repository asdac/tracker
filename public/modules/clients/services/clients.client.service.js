'use strict';

//Clients service used to communicate Clients REST endpoints
angular.module('clients')
	.factory('Clients', ['$resource',
		function ($resource) {
			return $resource('clients/:clientId', {
				clientId: '@_id'
			}, {
				update: {
					method: 'PUT'
				}
			});
		}
	])

	.factory('Notify', ['$rootScope',
		function ($rootScope) {
			var notify = {};

			notify.sendMsg = function (msg, data) {
				data = data || {};
				$rootScope.$emit(msg, data);
			};

			notify.getMsg = function (msg, func, scope) {
				var unbind = $rootScope.$on(msg, func);
				if (scope) {
					scope.$on('destroy', unbind);
				}
			};
			return notify;
		}
	]);
