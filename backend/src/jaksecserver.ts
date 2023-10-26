'use strict';

import express from 'express';
import { createServer } from 'http';
const app = express();
const http = createServer(app);
// server's adjustable settings
const port = 3002;

const startTime = new Date();

console.log(
    ' Backend server start time: ' + startTime.toLocaleString()
);

http.listen(port, () => {
    console.log(
        'JakSec backend frontend server Started at: http://localhost:' +
        port +
        '/index.html '
    );
});