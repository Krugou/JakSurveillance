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
			console.error(err);
			return res.status(403).json({
				message: 'User is not assigned to any courses, contact your teacher',
			});
		}
		req.login(user, {session: false}, async err => {
			if (err) {
				console.error(err);
				return res.status(403).json({
					message: 'User is not assigned to any courses, contact your teacher',
				});
			}
			if (user && !user.username) {
				try {
					// console.log('USERNAME WAS UPDATED');
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
