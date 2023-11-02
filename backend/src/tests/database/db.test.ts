import {Pool} from 'mysql2';
import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

// Mock the mysql2 module
jest.mock('mysql2', () => {
	return {
		createPool: jest.fn().mockImplementation(() => {
			return {
				getConnection: jest
					.fn()
					.mockImplementation((cb) => cb(null, 'connected')),
			};
		}),
	};
});

describe('Database Pool', () => {
	let pool: Pool;

	beforeEach(() => {
		jest.clearAllMocks();
		// Require the module after clearing the mocks
		pool = require('../../../database/db').default;
	});

	it('should create a pool', () => {
		expect(pool).toBeDefined();
		expect(mysql.createPool).toHaveBeenCalledTimes(1);
		expect(mysql.createPool).toHaveBeenCalledWith({
			host: process.env.DB_HOST as string,
			user: process.env.DB_USER as string,
			password: process.env.DB_PASS as string,
			database: process.env.DB_NAME as string,
			waitForConnections: true,
			connectionLimit: 10000,
			queueLimit: 0,
		});
	});

	it('should establish a connection', (done) => {
		pool.getConnection((err, connection) => {
			expect(err).toBeNull();
			expect(connection).toBe('connected');
			done();
		});
	});
});
