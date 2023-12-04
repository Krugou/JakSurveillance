import express, {Request, Response, Router} from 'express';
import usermodel from '../models/usermodel.js';
import {ResponseData, UserData} from '../types.js';
import doFetch from '../utils/doFetch.js';
//import { body, validationResult } from 'express-validator'; FOR VALIDATION
import jwt from 'jsonwebtoken';

import {User} from '../types.js';
import {authenticate} from '../utils/auth.js';
const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

const router: Router = express.Router();
// Define your route handlers with TypeScript types
router.get('/', (_req: Request, res: Response) => {
	res.send('Hello, TypeScript with Express! This is the users route calling');
});

router.post('/', async (req: Request, res: Response, next) => {
	// Check if the environment variables are not undefined
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable is not set');
	}

	if (
		!process.env.devaccount ||
		!process.env.devpass ||
		!process.env.devteacheraccount ||
		!process.env.devteacherpass ||
		!process.env.devstudentaccount ||
		!process.env.devstudentpass ||
		!process.env.devstudent2account ||
		!process.env.devstudent2pass ||
		!process.env.devcounseloraccount ||
		!process.env.devcounselorpass
	) {
		throw new Error('One or more environment variables are not set');
	}
	let metropoliaData: ResponseData;
	// Get username and password from the request body
	const {username, password} = req.body;

	// if the user is admin, return the admin account

	// create tokens for dev accounts and return them
	if (
		username === process.env.devaccount! &&
		password === process.env.devpass!
	) {
		metropoliaData = {
			staff: true,
			user: process.env.devaccount,
			firstname: 'Gustav',
			lastname: 'Admin',
			email: 'admin@metropolia.fi',
		};
	} else if (
		username === process.env.devteacheraccount! &&
		password === process.env.devteacherpass!
	) {
		metropoliaData = {
			staff: true,
			user: process.env.devteacheraccount,
			firstname: 'Willie',
			lastname: 'Teacher',
			email: 'teacher@metropolia.fi',
		};
	} else if (
		username === process.env.devstudentaccount! &&
		password === process.env.devstudentpass!
	) {
		metropoliaData = {
			staff: false,
			user: process.env.devstudentaccount,
			firstname: 'Sam',
			lastname: 'Student',
			email: 'student@metropolia.fi',
		};
	} else if (
		username === process.env.devstudent2account! &&
		password === process.env.devstudent2pass!
	) {
		metropoliaData = {
			staff: false,
			user: process.env.devstudent2account,
			firstname: 'Laurel',
			lastname: 'Student2',
			email: 'student2@metropolia.fi',
		};
	} else if (
		username === process.env.devcounseloraccount! &&
		password === process.env.devcounselorpass!
	) {
		metropoliaData = {
			staff: true,
			user: process.env.devcounseloraccount,
			firstname: 'Cass',
			lastname: 'Counselor',
			email: 'counselor@metropolia.fi',
		};
	} else {
		//TRY TO FIND USER IN METROPOLIA DATABASE
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({username, password}),
		};
		metropoliaData = await doFetch(loginUrl, options);

		if (metropoliaData.message === 'invalid username or password') {
			return res.status(403).json({
				message: 'Invalid username or password',
			});
		}
	}

	try {
		req.body.username = metropoliaData.email;
		// If the logged-in user is Metropolia staff and they don't exist in the DB yet, add them to the DB
		if (metropoliaData.staff === true) {
			try {
				// Check if the user exists in the database
				const userFromDB: unknown = await usermodel.getAllUserInfo(
					metropoliaData.email,
				);
				// dev purposes only change back to teacher only default when in production
				let roleid;
				switch (metropoliaData.user) {
					case 'admin':
						roleid = 4;
						break;
					case 'counselor':
						roleid = 2;
						break;
					default:
						roleid = 3; // default to teacher
				}
				const userData: UserData = {
					username: metropoliaData.user,
					staff: 1,
					first_name: metropoliaData.firstname,
					last_name: metropoliaData.lastname,
					email: metropoliaData.email,
					roleid: roleid,
				};

				//console.log(userFromDB);

				if (userFromDB === null) {
					// If the staff user doesn't exist, add them to the database
					const addStaffUserResponse = await usermodel.addStaffUser(userData);
					if (!addStaffUserResponse) {
						console.error('Failed to add staff user');
					}
					// Create a token for the user
					const token = jwt.sign(
						addStaffUserResponse as User,
						process.env.JWT_SECRET as string,
						{
							expiresIn: '2h',
						},
					);
					// Send the user and the token in the response
					if (addStaffUserResponse === null) {
						throw new Error('Failed to add staff user');
					}
					res.json({user: addStaffUserResponse, token});
				} else {
					// If the staff user exists, authenticate their login
					console.log('staff try to authenticate');
					authenticate(req, res, next, username);
				}
			} catch (error) {
				console.error(error);
				return res.status(500).json({error: 'Internal server error'});
			}
		}

		// If the logged-in user is not Metropolia staff, authenticate them
		if (metropoliaData.staff === false) {
			// Call the authenticate function to handle passport authentication
			console.log('non-staff try to authenticate');
			authenticate(req, res, next, username);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({error: 'Internal server error'});
	}
});

router.put('/accept-gdpr/:userid', async (req, res) => {
	const userId = Number(req.params.userid);
	console.log(userId, 'jotatjdkfgfdfd');
	try {
		await usermodel.updateUserGDPRStatus(userId);
		res.json({success: true});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});
router.get('/check-staff/:email', async (req: Request, res: Response) => {
	const email = req.params.email;
	try {
		const user = await usermodel.checkIfUserExistsByEmailAndisStaff(email);
		if (user.length > 0) {
			res.json({exists: true, user: user[0]});
		} else {
			res.json({exists: false});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});

export default router;
