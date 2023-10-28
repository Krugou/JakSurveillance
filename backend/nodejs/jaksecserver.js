'use strict';
import cors from 'cors';
import { config } from 'dotenv';
import courseRoutes from './routes/courseroutes.js';
import userRoutes from './routes/userroutes.js';
config();
console.log('dot env metropolia:' + process.env.APIKEYMETROPOLIA);
import express from 'express';
import { createServer } from 'http';
const app = express();
const http = createServer(app);
// server's adjustable settings
const port = 3002;
const startTime = new Date();
app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
console.log(' Backend server start time: ' + startTime.toLocaleString());
http.listen(port, () => {
    console.log('JakSec backend frontend server Started at: http://localhost:' +
        port +
        '/index.html ');
});
