'use strict';

var clientApp = angular.module('clients');
// Clients controller
clientApp.controller('ClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clients', '$modal', '$log', 'Notify',
	function ($scope, $stateParams, $location, Authentication, Clients, $modal, $log, Notify) {
		$scope.authentication = Authentication;

		this.clients = Clients.query({user: $scope.authentication.user._id});
		//this.client = clients[0];

		this.selectClient = function (client) {
			this.client = client;
		};

		//open a modal window to update a single customer record
		this.modalCreate = function (size) {
			var modalInstance = $modal.open({
				templateUrl: 'modules/clients/views/create-client.client.view.html',
				controller: function ($scope, $modalInstance) {
					$scope.ok = function () {
						$modalInstance.close();
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};

				},
				size: size
			});

			modalInstance.result.then(function (selectedCustomer) {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Remove existing Client
		this.remove = function (client) {
			if ( client ) { 
				client.$remove();
				Notify.sendMsg('NewClient', {'id': client._id});
				for (var i in $scope.clients) {
					if ($scope.clients [i] === client) {
						$scope.clients.splice(i, 1);
					}
				}
			} else {
				$scope.client.$remove(function() {
					$location.path('clients');
				});
			}
		};

		// Update existing Client
		this.update = function () {
			var client = $scope.client;

			client.$update(function() {
				Notify.sendMsg('NewClient', {'id': client._id});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
	}
]);

clientApp.controller('ClientsCreateController', ['$scope', 'Clients', 'Notify', 'Users', '$log',
	function ($scope, Clients, Notify, Users, $log) {

		this.users = Users.query();

		// Create new Client
		this.create = function (clientUser) {

			$log.info('create new client with user: ' + clientUser);
			// Create new Client object
			var client = new Clients();
			client.profile = clientUser._id;

			// Redirect after save
			client.$save(function (response) {
				Notify.sendMsg('NewClient', {'id': response._id});
				$scope.ok();
			}, function (errorResponse) {
				$scope.error = errorResponse.data.message;
				$log.error('error: ' + angular.toJson(errorResponse));
			});
		};
	}
]);

clientApp.directive('clients', ['Clients', 'Notify', function (Clients, Notify) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/clients/views/clients-list-template.html',
		link: function (scope, element, attrs) {
			Notify.getMsg('NewClient', function (event, data) {
				scope.clientsCtrl.clients = Clients.query({user: scope.authentication.user._id});
			});
		}
	};
}]);

clientApp.directive('client', ['Notify', function (Notify) {
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/clients/views/client-profile-template.html',
		link: function (scope, element, attrs) {
			//Notify.getMsg('clientSleceted', function(event, data){
			//	scope.clientsCtrl.client = data;
			//});
		}
	};
}]);
