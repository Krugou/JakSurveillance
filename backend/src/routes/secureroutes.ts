import express, {Request, Response, Router} from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	// console.log("🚀 ~ file: secureRoute.js:17 ~ router.get ~ req.user:", req.user)
	console.log(req.user);
	res.json(req.user);
});

export default router;
