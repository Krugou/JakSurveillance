import express, { Request, Response } from 'express';
import { Server, createServer } from 'http';

const app = express();
const http: Server = createServer(app);

// server's adjustable settings
const port: number = 3001;
const startTime: Date = new Date();

app.use(express.static('JakSec'));
app.get('*', (_req: Request, res: Response) => {
  res.sendFile('index.html', { root: 'JakSec' });
});

http.listen(port, () => {
  console.log(
    'JakSec FILE SERVER started at: http://localhost:' +
    port +
    '/index.html start time:' + startTime.toLocaleString()
  );
});
export default app;
