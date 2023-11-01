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

  // if the user is admin return the admin account
  if (username === process.env.devaccount && password === process.env.devpass) {
    res.json({
      staff: true,
      user: 'admin',
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@metropolia.fi',
    });
    return;
  }

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
    console.log('🚀 ~ file: userroutes.ts:72 ~ router.post ~ userInfo');
    const userInfo = await usermodel.getAllUserInfo(username);

    if (userInfo) {
      console.log('User information:', userInfo);
    } else {
      console.log('User not found.');
      return res.status(403).json({
        error: 'User has not been added to any courses, contact your teacher',
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Database error:', error.message);
    } else {
      // Handle the case where error is not an Error object
    }
  }
  interface ResponseData {
    message: string;
    staff: boolean;
    user: string;
    firstname: string;
    lastname: string;
    email: string;
    
    // Add other properties as needed
  }
  // TRY TO FIND USER IN METROPOLIA DATABASE
  try {
    const response = await fetch(loginUrl, options);

    const responseData = await response.json() as ResponseData;;

    if (responseData.message === 'invalid username or password') {
      return res.status(403).json({
        error: 'Login failed',
      });
    }
    if (!response.ok) {
      return res.status(500).json({
        error: 'Failed to connect to Metropolia servers',
      });
    }
    res.json(responseData);

    // if logged in user is metropolia staff
    if (responseData.staff) {
      try {
        const userData = {
          username: responseData.user,
          staff: 1,
          first_name: responseData.firstname,
          last_name: responseData.lastname,
          email: responseData.email,
        };

        const addUserResponse = await usermodel.addUser(userData);
        console.log(addUserResponse);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  //}
});

export default router;
