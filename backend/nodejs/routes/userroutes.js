import express from 'express';
const router = express.Router();
// Define your route handlers with TypeScript types
router.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
router.post('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
export default router;
