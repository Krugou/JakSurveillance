'use strict';
import cors from 'cors';
import {config} from 'dotenv';
import {Server} from 'socket.io';
import courseRoutes from './routes/courseroutes.js';
import secureRoutes from './routes/secureroutes.js';
import userRoutes from './routes/userroutes.js';
import setupSocketHandlers from './sockets/socketHandlers.js';
config();
// console.log('dot env metropolia:' + process.env.APIKEYMETROPOLIA);

import express from 'express';
import {createServer} from 'http';
import passport from './utils/pass.js';

const app = express();
const http = createServer(app);
const io = new Server(http, {
	cors: {
		origin: '*',
	},
});
setupSocketHandlers(io);
// server's adjustable settings
const port = 3002;
const startTime = new Date();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/users', userRoutes);
app.use(
	'/secure',
	passport.authenticate('jwt', {session: false}),
	secureRoutes,
);

app.use(
	'/courses',
	passport.authenticate('jwt', {session: false}),
	courseRoutes,
);

http.listen(port, () => {
	console.log(
		'JakSec REST + DATABASE SERVER Started at: http://localhost:' +
			port +
			'/index.html ' +
			'start time: ' +
			startTime.toLocaleString(),
	);
});
