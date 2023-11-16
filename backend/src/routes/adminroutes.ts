import express, {Request, Response, Router} from 'express';
import adminController from '../controllers/admincontroller.js';

const router: Router = express.Router();
router.get('/', async (_req: Request, res: Response) => {
	try {
		return await adminController.getServerSettings(_req as any, res as any);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});
router.post('/', async (req: Request, res: Response) => {
	try {
		return await adminController.updateServerSettings(req as any, res as any);
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});

export default router;
