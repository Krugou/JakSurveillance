import express, {Request, Response, Router} from 'express';

import {body} from 'express-validator';
import TopicGroupController from '../../controllers/topicgroupcontroller.js';
import TopicGroup from '../../models/topicgroupmodel.js';
import checkUserRole from '../../utils/checkRole.js';
import validate from '../../utils/validate.js';
const router: Router = express.Router();

router.get(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	async (_req: Request, res: Response) => {
		try {
			const topicData = await TopicGroup.fetchAllTopicGroupsWithTopics();

			res.send(topicData);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error');
		}
	},
);
router.post(
	'/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	[body('email').isEmail()],
	validate,
	async (req: Request, res: Response) => {
		
		try {
			const {email} = req.body;
			const topicGroupData =
				await TopicGroupController.getAllUserTopicGroupsAndTopics(email);
			res.send(topicGroupData);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error: ' + err);
		}
	},
);
router.post(
	'/update',
	checkUserRole(['admin', 'counselor', 'teacher']),
	[
		body('topicGroup').notEmpty(),
		body('topics.*').notEmpty(),
		body('email').isEmail(),
	],
	validate,
	async (req: Request, res: Response) => {
		try {
			const {topicGroup, topics, email} = req.body;

			if (!topicGroup) {
				return res.status(400).send({message: 'Topic group is required'});
			}
			if (
				!topics ||
				topics.length === 0 ||
				topics.every((topic: string) => topic.trim() === '')
			) {
				return res.status(400).send({message: 'Topics are required'});
			}
			const topicGroupData = await TopicGroupController.updateTopicGroup(
				topicGroup,
				topics,
				email,
			);
			res.status(200).send(topicGroupData);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error: ' + err);
		}
	},
);
router.post(
	'/update/:usercourseid',
	checkUserRole(['admin', 'counselor', 'teacher']),
	[body('modifiedTopics.*').notEmpty()],
	validate,
	async (req: Request, res: Response) => {
		try {
			const usercourseid = parseInt(req.params.usercourseid);
			const {modifiedTopics} = req.body;
			if (!modifiedTopics) {
				return res.status(400).send({message: 'Topics are required'});
			}

			const topicResponse = await TopicGroupController.updateUserCourseTopics(
				usercourseid,
				modifiedTopics,
			);
			res.status(200).send(topicResponse);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error: ' + err);
		}
	},
);
router.post(
	'/topicgroupcheck/',
	checkUserRole(['admin', 'counselor', 'teacher']),
	[body('topicGroup').notEmpty(), body('email').isEmail()],
	validate,
	async (req: Request, res: Response) => {
		try {
			const {topicGroup, email} = req.body;

			if (!topicGroup) {
				return res.status(400).send({message: 'Topic group is required'});
			}
			const topicGroupResult =
				await TopicGroupController.checkIfTopicGroupExistsWithEmail(
					topicGroup as string,
					email as string,
				);
			
			res.status(200).send(topicGroupResult);
		} catch (err) {
			console.error(err);
			res.status(500).send('Server error: ' + err);
		}
	},
);

export default router;
