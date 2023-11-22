import express, {Request, Response, Router} from 'express';
import passport from 'passport';
import usermodel from '../models/usermodel.js';
import fetchReal from '../utils/fetch.js';
//import { body, validationResult } from 'express-validator'; FOR VALIDATION
import jwt from 'jsonwebtoken';
import UserModel from '../models/usermodel.js';
import {User, generateTokenAndUser} from '../utils/pass.js';
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
				return res.status(403).json({
					message: 'User is not assigned to any courses, contact your teacher',
				});
			}
			req.login(user, {session: false}, err => {
				if (err) {
					console.error(err);
					return res.status(403).json({
						message: 'User is not assigned to any courses, contact your teacher',
					});
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
interface ResponseData {
	message: string;
	staff: boolean;
	user: string;
	firstname: string;
	lastname: string;
	email: string;
}
router.post('/', async (req: Request, res: Response, next) => {
	let metropoliaData: ResponseData;
	// Get username and password from the request body
	const {username, password} = req.body;

	// if the user is admin, return the admin account

	// create tokens for dev accounts and return them
	if (username === process.env.devaccount && password === process.env.devpass) {
		metropoliaData = {
			staff: true,
			user: process.env.devaccount,
			firstname: 'Admin',
			lastname: 'Admin',
			email: 'admin@metropolia.fi',
		};
	} else if (
		username === process.env.devteacheraccount &&
		password === process.env.devteacherpass
	) {
		metropoliaData = {
			staff: true,
			user: 'teacher',
			firstname: 'Teacher',
			lastname: 'Teacher',
			email: 'teacher@metropolia.fi',
		};
	} else if (
		username === process.env.devstudentaccount &&
		password === process.env.devstudentpass
	) {
		metropoliaData = {
			staff: false,
			user: process.env.devstudentaccount,
			firstname: 'Student',
			lastname: 'Student',
			email: 'student@metropolia.fi',
		};
	} else if (
		username === process.env.devstudent2account &&
		password === process.env.devstudent2pass
	) {
		metropoliaData = {
			staff: false,
			user: process.env.devstudent2account,
			firstname: 'Student2',
			lastname: 'Student2',
			email: 'student2@metropolia.fi',
		};
	} else if (
		username === process.env.devcounseloraccount &&
		password === process.env.devcounselorpass
	) {
		metropoliaData = {
			staff: true,
			user: process.env.devcounseloraccount,
			firstname: 'Counselor',
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
		metropoliaData = await fetchReal.doFetch(loginUrl, options);

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
				const userFromDB: unknown = await UserModel.getAllUserInfo(
					metropoliaData.email,
				);

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
				const userData = {
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
					const addStaffUserResponse = await UserModel.addStaffUser(userData);
					if (!addStaffUserResponse) {
						console.error('Failed to add staff user');
					}
				}
				// Call the authenticate function to handle passport authentication
				console.log('staff try to authenticate');
				authenticate(req, res, next, username);
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

export default router;
