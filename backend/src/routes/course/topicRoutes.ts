import express, {Request, Response, Router} from 'express';

import TopicGroupController from '../../controllers/topicgroupcontroller.js';
import TopicGroup from '../../models/topicgroupmodel.js';

const router: Router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
	try {
		const topicData = await TopicGroup.fetchAllTopicGroupsWithTopics();

		res.send(topicData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error');
	}
});
router.post('/', async (req: Request, res: Response) => {
	try {
		const {email} = req.body;
		const topicGroupData =
			await TopicGroupController.getAllUserTopicGroupsAndTopics(email);
		res.send(topicGroupData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error: ' + err);
	}
});
router.post('/update', async (req: Request, res: Response) => {
	try {
		const {topicGroup, topics, email} = req.body;
		console.log(
			'🚀 ~ file: topicRoutes.ts:32 ~ router.post ~ req.body:',
			req.body,
		);
		// const topicGroupData = await TopicGroupController.updateTopicGroup(
		// 	topicGroup,
		// 	topics,
		// 	email,
		// );
		// res.send(topicGroupData);
	} catch (err) {
		console.error(err);
		res.status(500).send('Server error: ' + err);
	}
});

export default router;
