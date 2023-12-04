'use strict';

import cors from 'cors';
import {config} from 'dotenv';
import {Server} from 'socket.io';
import adminRoutes from './routes/adminroutes.js';
import courseRoutes from './routes/courseroutes.js';
import secureRoutes from './routes/secureroutes.js';
import userRoutes from './routes/userroutes.js';
import setupSocketHandlers from './sockets/socketHandlers.js';

/**
 * Load environment variables from .env file
 */
config();

import express from 'express';
import {createServer} from 'http';
import passport from './utils/pass.js';

/**
 * Express application instance
 * @type {express.Express}
 */
const app = express();

/**
 * HTTP server instance
 * @type {http.Server}
 */
const http = createServer(app);

/**
 * Socket.IO server instance
 * @type {socket.io.Server}
 */
const io = new Server(http, {
	cors: {
		origin: '*',
	},
});

/**
 * Setup socket handlers
 */
setupSocketHandlers(io);

/**
 * Port number for the server to listen on
 * @type {number}
 */
const port = 3002;

/**
 * Server start time
 * @type {Date}
 */
const startTime = new Date();

/**
 * Use JSON middleware for Express to parse JSON bodies
 */
app.use(express.json());

/**
 * Use CORS middleware to enable CORS
 */
app.use(cors());

/**
 * Initialize Passport middleware
 */
app.use(passport.initialize());

/**
 * Use user routes for /users path
 */
app.use('/users', userRoutes);

/**
 * Use secure routes for /secure path with JWT authentication
 */
app.use(
	'/secure',
	passport.authenticate('jwt', {session: false}),
	secureRoutes,
);

/**
 * Use course routes for /courses path with JWT authentication
 */
app.use(
	'/courses',
	passport.authenticate('jwt', {session: false}),
	courseRoutes,
);

/**
 * Use admin routes for /admin path with JWT authentication
 */
app.use('/admin', passport.authenticate('jwt', {session: false}), adminRoutes);

/**
 * Start the server
 */
http.listen(port, () => {
	console.log(
		'JakSec REST + DATABASE SERVER Started at: http://localhost:' +
			port +
			'/index.html ' +
			'start time: ' +
			startTime.toLocaleString(),
	);
});
