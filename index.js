'use strict';

/**
 * Module Dependencies
 */
const config = require('./config'),
	restify = require('restify'),
	bunyan = require('bunyan'),
	winston = require('winston'),
	bunyanWinston = require('bunyan-winston-adapter'),
	mongoose = require('mongoose'),
	restifyPlugins = require('restify-plugins');

/**
 * Logging
 */
global.log = new winston.Logger({
	transports: [
		new winston.transports.Console({
			level: 'info',
			timestamp: () => {
				return new Date().toString();
			},
			json: true,
		}),
	],
});

/**
  * Initialize Server
  */
global.server = restify.createServer({
	name: config.name,
	version: config.version,
	log: bunyanWinston.createAdapter(log),
});

/**
  * Middleware
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());

/**
  * Lift Server, Connect to DB & Bind Routes
  */
server.listen(config.port, function() {
	// establish connection to mongodb atlas
	mongodb.connect(config.db.uri, (err, db) => {
		if (err) {
			console.log(
				'An error occurred while attempting to connect to MongoDB',
				err,
			);
			process.exit(1);
		}

		console.log(
			'%s v%s ready to accept connections on port %s in %s environment.',
			server.name,
			config.version,
			config.port,
			config.env,
		);

		require('./routes')({ db, server });
	});
});
