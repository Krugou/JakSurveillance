import express from 'express';
import { createServer } from 'http';
const app = express();
const http = createServer(app);
// server's adjustable settings
const port = 3001;
const startTime = new Date();
console.log(' Backend chat/frontend server start time: ' + startTime.toLocaleString());
app.use(express.static('JakSec'));
app.get('*', (_req, res) => {
    res.sendFile('index.html', { root: 'JakSec' });
});
http.listen(port, () => {
    console.log('JakSec backend frontend server Started at: http://localhost:' +
        port +
        '/index.html ');
});
