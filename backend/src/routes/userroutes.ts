import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests if running older version of nodejs
import usermodel from '../models/usermodel.js';
const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const router: Router = express.Router();

// Define your route handlers with TypeScript types
router.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! this is users route calling');
});

router.post('/', async (req: Request, res: Response) => {
  // Get username and password from the request body
  const { username, password } = req.body;

  /*
  if (username === 'admin' && password === 'admin') {
    res.json({
      "staff": true,
      "user": "admin",
      "firstname": "Admin",
      "lastname": "Admin",
      "email": "admin@metropolia.fi"
    });
  } else if (username === 'teacher' && password === 'teacher') {
    res.json({
      "staff": true,
      "user": "teacher",
      "firstname": "Teacher",
      "lastname": "Teacher",
      "email": "teacher@metropolia.fi"
    });
  } else if (username === 'counselor' && password === 'counselor') {
    res.json({
      "staff": true,
      "user": "counselor",
      "firstname": "Counselor",
      "lastname": "Counselor",
      "email": "counselor@metropolia.fi"
    });
  } else if (username === 'student' && password === 'student') {
    res.json({
      "staff": false,
      "user": "student",
      "firstname": "Student",
      "lastname": "Student",
      "email": "student@metropolia.fi"
    });
  } else if(username === 'mranderson'&& password === 'student') {
    res.json({
      "staff": false,
      "user": "MrAnderson",
      "firstname": "Mr",
      "lastname": "Anderson",
      "email": "mr.anderson@example.com"
    });
  } else {
    */

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  };

  // TRY TO FIND USER FROM DATABASE FIRST

  try {
    console.log('awdawdwa');
    const userInfo = await usermodel.getAllUserInfo(username);

    if (userInfo) {
      console.log('User information:', userInfo);
    } else {
      console.log('User not found.');
    }
  } catch (error) {
    console.error('Database error:', error.message);
  }

  try {
    const response = await fetch(loginUrl, options);

    if (!response.ok) {
      res.status(response.status).json({ error: 'Login failed' });
      return;
    }

    const responseData = await response.json();

    res.json(responseData);

    // if logged in user is not metropolia staff
    if (responseData.staff === false) {
      res.status(403).json({
        error: 'User has not been added to any courses, contact your teacher',
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  //}
});

export default router;
