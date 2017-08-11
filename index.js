'use strict'

/**
 * Module Dependencies
 */
 const config        = require('./config'),
       restify       = require('restify'),
       bunyan        = require('bunyan'),
       winston       = require('winston'),
       bunyanWinston = require('bunyan-winston-adapter'),
       mongoose      = require('mongoose'),
       restifyPlugins = require('restify-plugins')


 /**
 * Logging
 */
 global.log = new winston.Logger({
   transports: [
       new winston.transports.Console({
           level: 'info',
           timestamp: () => {
               return new Date().toString()
           },
           json: true
       }),
   ]
 })

 /**
  * Initialize Server
  */
 global.server = restify.createServer({
     name    : config.name,
     version : config.version,
     log     : bunyanWinston.createAdapter(log),
 })

 /**
  * Middleware
  */
 server.use(restifyPlugins.jsonBodyParser({ mapParams: true }))
 server.use(restifyPlugins.acceptParser(server.acceptable))
 server.use(restifyPlugins.queryParser({ mapParams: true }))
 server.use(restifyPlugins.fullResponse())

 /**
  * Error Handling
  */
 server.on('uncaughtException', (req, res, route, err) => {
     log.error(err.stack)
     res.send(err)
 });

 /**
  * Lift Server, Connect to DB & Bind Routes
  */
 server.listen(config.port, function() {

     mongoose.connection.on('error', function(err) {
         log.error('Mongoose default connection error: ' + err)
         process.exit(1)
     })

     mongoose.connection.on('open', function(err) {

         if (err) {
             log.error('Mongoose default connection error: ' + err)
             process.exit(1)
         }

         log.info(
             '%s v%s ready to accept connections on port %s in %s environment.',
             server.name,
             config.version,
             config.port,
             config.env
         )

         require('./routes')

     })

     global.db = mongoose.connect(config.db.uri)

 })
