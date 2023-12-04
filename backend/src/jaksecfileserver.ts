import express, {Request, Response} from 'express';
import {Server, createServer} from 'http';

/**
 * Express application instance
 * @type {express.Express}
 */
const app = express();

/**
 * HTTP server instance
 * @type {http.Server}
 */
const http: Server = createServer(app);

/**
 * Port number for the server to listen on
 * @type {number}
 */
const port: number = 3001;

/**
 * Server start time
 * @type {Date}
 */
const startTime: Date = new Date();

/**
 * Use static middleware for Express to serve static files from 'jaksec' directory
 */
app.use(express.static('jaksec'));

/**
 * Setup route to serve index.html for all unmatched routes
 * @param {express.Request} _req - The request object
 * @param {express.Response} res - The response object
 */
app.get('*', (_req: Request, res: Response) => {
	res.sendFile('index.html', {root: 'jaksec'});
});

/**
 * Start the server
 */
http.listen(port, () => {
	console.log(
		'JakSec FILE SERVER started at: http://localhost:' +
			port +
			'/index.html start time:' +
			startTime.toLocaleString(),
	);
});

export default app;
