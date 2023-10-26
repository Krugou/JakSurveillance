import express from 'express';
const router = express.Router();
// Define your route handlers with TypeScript types
router.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
router.post('/', (req, res) => {
    const { username, password } = req.body;
    // Now, you can access the 'username' and 'password' from the request body
    console.log(`Received username: ${username}, password: ${password}`);
    res.send('Hello, TypeScript with Express!');
});
export default router;
