'use strict';

module.exports = {
	db: 'mongodb://asdac-tracker:ramandeep123ramandeep123@ds062797.mongolab.com:62797/tracker',
	app: {
		title: 'Tracker - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1427484354218281',
		clientSecret: process.env.FACEBOOK_SECRET || '1feeddbb610866ff1ee64ed1700e307c',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	fitbit: {
		clientID: process.env.FIRBIT_ID || 'bb6c56c748d44b60876a5d7d61bb52b0',
		clientSecret: process.env.FITBIT_SECRET || '57d74a3f78f443c89322f8fabefe2c6c',
		callbackURL: '/auth/fitbit/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
