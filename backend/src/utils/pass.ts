'use strict';
import {config} from 'dotenv';
import {User} from '../types.js';
config();

// Import necessary modules and dependencies
import passport from 'passport';
import passportJWT from 'passport-jwt';
import {Strategy} from 'passport-local';
import UserModel from '../models/usermodel.js'; // Import the UserModel without '.js'
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

interface DoneFunction {
	(
		error: null | Error,
		user?: false | User | undefined,
		options?: {message: string},
	): void;
}
// Define a local strategy for email and password login
passport.use(
	new Strategy(async (email: string, _password: string, done: DoneFunction) => {
		try {
			// Find a user in the database with the provided email
			const user: User | null = await UserModel.getAllUserInfo(email);

			// Check if the user exists
			console.log(email, 'IAWJDUOIAWDIOJAWD ');
			if (user === null || user === undefined) {
				return done(null, false, {message: 'Incorrect username.'});
			}

			return done(null, user, {message: 'Logged In Successfully'});
		} catch (err) {
			return done(err instanceof Error ? err : new Error(String(err)));
		}
	}),
);

interface JwtPayload {
	[key: string]: unknown;
}

interface DoneJwtFunction {
	(error: unknown, user?: JwtPayload): void;
}

// Define a JWT strategy for handling JSON Web Tokens
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET as string, // Assert process.env.JWT_SECRET as a string
		},
		(jwtPayload: JwtPayload, done: DoneJwtFunction) => {
			//console.log('JWTStrategy', jwtPayload); // Log the JWT payload
			done(null, jwtPayload); // Pass the JWT payload as the authenticated user
		},
	),
);

export default passport; // Export passport as the default export
