import { createStream } from 'rotating-file-stream';
import pino from 'pino';

// Stream for regular logs
const stream = createStream('logfile.log', {
  interval: '14d',
  path: './logs',
});

// Stream for error logs
const errorStream = createStream('error-logfile.log', {
  interval: '14d',
  path: './logs',
});

// Create a new pino logger that writes logs to our rotating file stream.
// The logger is configured to log messages with a level of 'info' and above.
const logger = pino({ level: 'info' }, stream);

// Create a new pino logger that writes logs to our rotating file stream.
// The logger is configured to log messages with a level of 'error' and above.
logger.error = pino({ level: 'error' }, errorStream).error;

// Log critical actions
logger.info('Logger initialized');
logger.info('Application started');
logger.info('Database connection established');

// Export the logger so it can be used in other parts of our application.
export default logger;
