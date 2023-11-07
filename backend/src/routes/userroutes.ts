import express, {Request, Response, Router} from 'express';
import passport from 'passport';
import usermodel from '../models/usermodel.js';
import fetchReal from '../utils/fetch.js';
//import { body, validationResult } from 'express-validator'; FOR VALIDATION
import jwt from 'jsonwebtoken';
import httpError from '../utils/errors.js';
import {User} from '../utils/pass.js';

const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const router: Router = express.Router();

// Define your route handlers with TypeScript types
router.get('/', (_req: Request, res: Response) => {
	res.send('Hello, TypeScript with Express! This is the users route calling');
});

// Define a separate function for handling passport authentication
const authenticate = (
	req: Request,
	res: Response,
	next: (err?: any) => void,
) => {
	passport.authenticate(
		'local',
		{session: false},
		(err: Error, user: User, _info: any) => {
			// console.log('info: ', info);
			// console.log('err1: ', err);
			if (err || !user) {
				next(httpError('Virhe kirjautuessa', 403));
				return res.status(403).json({
					message: 'Something went wrong, check your inputs',
				});
			}
			req.login(user, {session: false}, err => {
				if (err) {
					// console.log('err2: ', err);
					next(httpError('Virhe kirjautuessa', 403));
					return res.status(403).json({
						message: 'Something went wrong, check your inputs',
					});
				}
				const token = jwt.sign(
					user as User,
					process.env.JWT_SECRET as string,
					{expiresIn: '2h'}, // Set the expiration time to 1 minute for testing
				);
				res.json({user, token});
			});
		},
	)(req, res, next);
};

router.post('/', async (req: Request, res: Response, next) => {
	// Get username and password from the request body
	const {username, password} = req.body;

	// if the user is admin, return the admin account
	if (username === process.env.devaccount && password === process.env.devpass) {
		res.json({
			staff: true,
			user: 'admin',
			firstname: 'Admin',
			lastname: 'Admin',
			email: 'admin@metropolia.fi',
		});
		return;
	} else if (
		username === process.env.devteacheraccount &&
		password === process.env.devteacherpass
	) {
		res.json({
			staff: true,
			user: 'teacher',
			firstname: 'Teacher',
			lastname: 'Teacher',
			email: 'teacher@metropolia.fi',
		});
		return;
	} else if (
		username === process.env.devstudentaccount &&
		password === process.env.devstudentpass
	) {
		res.json({
			staff: false,
			user: 'student',
			firstname: 'Student',
			lastname: 'Student',
			email: 'student@metropolia.fi',
		});
		return;
	} else if (
		username === process.env.devcounseloraccount &&
		password === process.env.devcounselorpass
	) {
		res.json({
			staff: true,
			user: 'counselor',
			firstname: 'Counselor',
			lastname: 'Counselor',
			email: 'counselor@metropolia.fi',
		});
		return;
	}

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({username, password}),
	};

	interface ResponseData {
		message: string;
		staff: boolean;
		user: string;
		firstname: string;
		lastname: string;
		email: string;
	}
	//TRY TO FIND USER IN METROPOLIA DATABASE
	try {
		const metropoliaData: ResponseData = await fetchReal.doFetch(
			loginUrl,
			options,
		);
		if (metropoliaData.message === 'invalid username or password') {
			return res.status(403).json({
				error: 'Login failed',
			});
		}

		// TRY TO FIND USER IN JAKSEC DATABASE
		let userInfo;
		try {
			userInfo = await usermodel.getAllUserInfo(username);

			if (userInfo) {
				console.log('User information:', userInfo);
			} else if (!userInfo && metropoliaData.staff === false) {
				console.log('User not found.');
				return res.status(403).json({
					error: 'User has not been added to any courses, contact your teacher',
				});
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error('Database error:', error.message);
			} else {
				// Handle the case where error is not an Error object
			}
		}

		// If the logged-in user is Metropolia staff and they don't exist in the DB yet, add them to the DB
		if (metropoliaData.staff === true && !userInfo) {
			try {
				const userData = {
					username: metropoliaData.user,
					staff: 1,
					first_name: metropoliaData.firstname,
					last_name: metropoliaData.lastname,
					email: metropoliaData.email,
				};

				const addUserResponse = await usermodel.addUser(userData);
				console.log(addUserResponse);
			} catch (error) {
				console.error(error);
				return res.status(500).json({error: 'Internal server error'});
			}
		}

		// IF THE USER is found in database or they're staff (meaning their account gets created with first login), implement login for them
		if (userInfo || metropoliaData.staff) {
			// Call the authenticate function to handle passport authentication
			authenticate(req, res, next);
			console.log('try to authentticate');
		}

		// res.json(metropoliaData);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
});

export default router;
