import express, {Request, Response} from 'express';
import {Server, createServer} from 'http';

/**
 * Initialize Express application
 */
const app = express();

/**
 * Create HTTP server
 */
const http: Server = createServer(app);

// Server's adjustable settings
const port: number = 3001;
const startTime: Date = new Date();

/**
 * Use static middleware for Express to serve static files from 'JakSec' directory
 */
app.use(express.static('JakSec'));

/**
 * Setup route to serve index.html for all unmatched routes
 */
app.get('*', (_req: Request, res: Response) => {
	res.sendFile('index.html', {root: 'JakSec'});
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
