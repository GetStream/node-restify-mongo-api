'use strict';

module.exports = {
	name: 'API',
	version: '0.0.2',
	env: process.env.NODE_ENV || 'development',
	port: process.env.PORT || 3000,
	base_url: process.env.BASE_URL || 'http://localhost:3000',
	db: {
		uri: 'mongodb://127.0.0.1:27017/api',
	},
};
