'use strict';

// Configuring the new module
angular.module('measurements').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Measurements', 'measurements', 'link', '/measurements');
	}
]).run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});
