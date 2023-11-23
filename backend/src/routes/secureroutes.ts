import express, {Request, Response, Router} from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
	//console.log('🚀 ~ file: secureroutes.ts:8 ~ router.get ~ req.user:', req.user);
	res.json(req.user);
});

export default router;
