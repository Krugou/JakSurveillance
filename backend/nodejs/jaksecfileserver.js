import express from 'express';
import { createServer } from 'http';
const app = express();
const http = createServer(app);
// server's adjustable settings
const port = 3001;
const startTime = new Date();
app.use(express.static('JakSec'));
app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: 'JakSec' });
});
http.listen(port, () => {
    console.log('JakSec FILE SERVER started at: http://localhost:' +
        port +
        '/index.html start time:' + startTime.toLocaleString());
});
