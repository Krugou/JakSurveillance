import express from 'express';

const router: Router = express.Router();

// Define your route handlers with TypeScript types
router.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

router.post('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
  console.log(req.body);
  // Now, you can access the 'username' and 'password' from the request body
  //console.log(`Received username: ${username}, password: ${password}`);
});

export default router;
