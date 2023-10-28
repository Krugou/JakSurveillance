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

  // Create the request options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  };

  try {
    // Send a POST request to the loginUrl
    const response = await fetch(loginUrl, options);

    if (!response.ok) {
      // Handle the case when the response status is not OK
      res.status(response.status).json({ error: 'Login failed' });
      return;
    }

    const responseData = await response.json();
    // Handle the successful response data
    console.log(responseData);
    res.json(responseData);
  } catch (error) {
    // Handle any errors that occur during the request
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
