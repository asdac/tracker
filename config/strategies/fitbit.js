'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	FitbitStrategy = require('passport-fitbit').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use fitbit strategy
	passport.use(new FitbitStrategy({
			consumerKey: config.fitbit.clientID,
			consumerSecret: config.fitbit.clientSecret,
			callbackURL: config.fitbit.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens

			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			var providerUserProfile = {
				email: 'amardeep.singh-sibia@asdac.co.uk',
				provider: 'fitbit',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};
