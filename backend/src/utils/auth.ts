import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import usermodel from '../models/usermodel.js';
import {User} from '../types.js';
/**
 * Authenticates a user and generates a JWT token for them.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {(err?: Error | null) => void} next - The next middleware function.
 * @param {string} newUsername - The new username for the user.
 */
export const authenticate = (
	req: Request,
	res: Response,
	next: (err?: Error | null) => void,
	newUsername: string,
) => {
	passport.authenticate('local', {session: false}, (err: Error, user: User) => {
		if (err || !user) {
			console.log('User is not assigned to any courses ');
			console.error('User not found in database, error:', err);
			return res.status(403).json({
				message:
					'You are currently not assigned to any courses. Please contact your teacher to be assigned to a course.',
			});
		}
		req.login(user, {session: false}, async err => {
			if (err) {
				console.log('User is not assigned to any courses ', user.email);
				console.error('User found in database, error:', err);
				return res.status(403).json({
					message:
						'You are registered in the system but not assigned to any courses. Please contact your teacher to be assigned to a course.',
				});
			}
			if (user && !user.username) {
				try {
					console.log(
						'New login detected for user without username, updating ',
						newUsername,
						' ',
						user.email,
					);
					await usermodel.updateUsernameByEmail(user.email, newUsername);
				} catch (error) {
					console.error(error);
				}
				user.username = newUsername;
			}
			const token = jwt.sign(user as User, process.env.JWT_SECRET as string, {
				expiresIn: '2h',
			});
			res.json({user, token});
		});
	})(req, res, next);
};
