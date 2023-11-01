'use strict';
import cors from 'cors';
import crypto from 'crypto';
import { config } from 'dotenv';
import { Server } from 'socket.io';
import courseRoutes from './routes/courseroutes.js';
import userRoutes from './routes/userroutes.js';
config();
// console.log('dot env metropolia:' + process.env.APIKEYMETROPOLIA);

import express from 'express';
import { createServer } from 'http';
const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: "http://localhost:8080", // replace with your client's origin
    methods: ["GET", "POST"],
    credentials: true
  }
});
// server's adjustable settings
const port = 3002;
const startTime = new Date();

app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

let hash = '';
let timestamps: { start: number; end: number; hash: string; }[] = [];

// this defines how often the hash changes or how fast student need to be in class while doing attendance
const speedOfHashChange = 5000; // milliseconds
// this defines how fast the student has to be in class to get attendance
const howMuchLeeWay = 30000; // milliseconds
const updateHash = () => {
  const start = Date.now();
  hash = crypto.randomBytes(20).toString('hex');
  // console.log('Updated hash:', hash);
  const end = Date.now() + speedOfHashChange;

  timestamps.push({ start, end, hash });
  const timestampslength = (howMuchLeeWay / speedOfHashChange);

  if (timestamps.length > timestampslength {
    timestamps.shift();
  }

  // console.log('Timestamps:', timestamps);
};

// update the hash immediately and then every 5 seconds
updateHash();
setInterval(updateHash, speedOfHashChange);
// handle new socket.io connections
io.on('connection', (socket) => {
  console.log('a user connected');
  // handle disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('getCurrentHashForQrGenerator', () => {

    // Emit the event every `speedOfHashChange` milliseconds
    const intervalId = setInterval(() => {

      socket.emit('getCurrentHashForQrGeneratorServingHashAndChangeTime', hash, speedOfHashChange);
    }, speedOfHashChange);

    // Clear the interval when the socket disconnects
    socket.on('disconnect', () => {
      clearInterval(intervalId);
    });
  });
  socket.on('inputThatStudentHasArrivedToClass', (secureHash, studentId, unixtime) => {
    console.log('secureHash:', secureHash);
    console.log('studentId:', studentId);
    console.log('unixtime:', unixtime);

    // find the timestamp that matches the secureHash and unixtime
    const timestamp = timestamps.find(t => t.hash === secureHash && unixtime >= t.start && unixtime <= t.end);

    if (timestamp) {
      console.log('Accepted:', secureHash, studentId, unixtime);
    } else {
      io.emit('inputThatStudentHasArrivedToClassTooSlow', 'Too slow'); // send error message to all clients
    }
  });
});
http.listen(port, () => {
  console.log(
    'JakSec REST + DATABASE SERVER Started at: http://localhost:' +
    port +
    '/index.html ' + 'start time: ' + startTime.toLocaleString()
  );
});
