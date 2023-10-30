import express, { Request, Response, Router } from 'express';
import fetch from 'node-fetch'; // Import node-fetch for making HTTP requests if running older version of nodejs

const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const router: Router = express.Router();

// Define your route handlers with TypeScript types
router.get('/', (_req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express! this is users route calling');
});

router.post('/', async (req: Request, res: Response) => {
  // Get username and password from the request body
  const { username, password } = req.body;

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
  } else {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    };

    try {
      const response = await fetch(loginUrl, options);

      if (!response.ok) {
        res.status(response.status).json({ error: 'Login failed' });
        return;
      }

      const responseData = await response.json();
      res.json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
