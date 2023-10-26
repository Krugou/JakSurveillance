import express, { Request, Response } from 'express';
import { Server, createServer } from 'http';

const app = express();
const http: Server = createServer(app);

// server's adjustable settings
const port: number = 3001;
const startTime: Date = new Date();

console.log(
  ' Backend chat/frontend server start time: ' + startTime.toLocaleString()
);
app.use(express.static('JakSec'));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'JakSec' });
});

http.listen(port, () => {
  console.log(
    'JakSec backend frontend server Started at: http://localhost:' +
      port +
      '/index.html '
  );
});
