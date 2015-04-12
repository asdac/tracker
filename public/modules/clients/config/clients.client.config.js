'use strict';

// Configuring the new module
angular.module('clients').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Clients', 'clients', 'dropdown', '/clients(/create)?',false,['trainer']);
		Menus.addSubMenuItem('topbar', 'clients', 'List Clients', 'clients');
		Menus.addSubMenuItem('topbar', 'clients', 'New Client', 'clients/create');
	}
]);
