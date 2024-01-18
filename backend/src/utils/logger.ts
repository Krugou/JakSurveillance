import rfs from 'rotating-file-stream';

// Use require syntax for pino
import pino from 'pino';

const stream = rfs.createStream('logfile.log', {
	interval: '14d',
	path: './logfiles',
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const logger = pino({level: 'info'}, stream);

export default logger;
