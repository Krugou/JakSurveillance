import express, {Request, Response, Router} from 'express';
import passport from 'passport';
import usermodel from '../models/usermodel.js';
import fetchReal from '../utils/fetch.js';
//import { body, validationResult } from 'express-validator'; FOR VALIDATION
import jwt from 'jsonwebtoken';
import httpError from '../utils/errors.js';
import {User} from '../utils/pass.js';
import {generateTokenAndUser} from '../utils/pass.js';
const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const router: Router = express.Router();

// Define your route handlers with TypeScript types
router.get('/', (_req: Request, res: Response) => {
	res.send('Hello, TypeScript with Express! This is the users route calling');
});

// Define a separate function for handling passport authentication

const updateUsername = async (email: string, newUsername: string) => {
	try {
		console.log('USERNAME WAS UPDATED');
		await usermodel.updateUsernameByEmail(email, newUsername);
	} catch (error) {
		console.error(error);
	}
};

const authenticate = (
	req: Request,
	res: Response,
	next: (err?: any) => void,
	newUsername: string,
) => {
	passport.authenticate(
		'local',
		{session: false},
		(err: Error, user: User, _info: any) => {
			if (err || !user) {
				console.error(err);
				return next(httpError('Error during authentication', 403));
			}
			req.login(user, {session: false}, err => {
				if (err) {
					console.error(err);
					return next(httpError('Error during authentication', 403));
				}
				if (user && !user.username) {
					updateUsername(user.email, newUsername);
					user.username = newUsername;
				}
				const token = jwt.sign(user as User, process.env.JWT_SECRET as string, {
					expiresIn: '2h',
				});
				res.json({user, token});
			});
		},
	)(req, res, next);
};

router.post('/', async (req: Request, res: Response, next) => {
	// Get username and password from the request body
	const {username, password} = req.body;

	// if the user is admin, return the admin account

	// create tokens for dev accounts and return them
	if (username === process.env.devaccount && password === process.env.devpass) {
		res.json(
			generateTokenAndUser(
				'admin',
				'admin',
				'Admin',
				'Admin',
				'admin@metropolia.fi',
			),
		);
		return;
	} else if (
		username === process.env.devteacheraccount &&
		password === process.env.devteacherpass
	) {
		res.json(
			generateTokenAndUser(
				'teacher',
				'teacher',
				'Teacher',
				'Teacher',
				'teacher@metropolia.fi',
			),
		);
		return;
	} else if (
		username === process.env.devstudentaccount &&
		password === process.env.devstudentpass
	) {
		res.json(
			generateTokenAndUser(
				'student',
				'student',
				'Student',
				'Student',
				'student@metropolia.fi',
			),
		);
		return;
	} else if (
		username === process.env.devstudent2account &&
		password === process.env.devstudent2pass
	) {
		res.json(
			generateTokenAndUser(
				'student2',
				'student2',
				'Student2',
				'Student2',
				'student2@metropolia.fi',
			),
		);
		return;
	} else if (
		username === process.env.devcounseloraccount &&
		password === process.env.devcounselorpass
	) {
		res.json(
			generateTokenAndUser(
				'counselor',
				'counselor',
				'Counselor',
				'Counselor',
				'counselor@metropolia.fi',
			),
		);
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
				error: 'Invalid username or password',
			});
		}
		req.body.username = metropoliaData.email;
		// If the logged-in user is Metropolia staff and they don't exist in the DB yet, add them to the DB
		if (metropoliaData.staff === true) {
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

		// Call the authenticate function to handle passport authentication
		authenticate(req, res, next, username);
		console.log('try to authentticate');

		// res.json(metropoliaData);
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
});

export default router;
