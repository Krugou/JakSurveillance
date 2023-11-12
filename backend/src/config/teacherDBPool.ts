import {config} from 'dotenv';
config();

import mysql, {Pool} from 'mysql2';

const pool: Pool = mysql.createPool({
	host: process.env.DB_HOST as string,
	user: process.env.DB_USERTEACHER as string,
	password: process.env.DB_PASSTEACHER as string,
	database: process.env.DB_NAME as string,
	waitForConnections: true,
	connectionLimit: 10000,
	queueLimit: 0,
});

export default pool;