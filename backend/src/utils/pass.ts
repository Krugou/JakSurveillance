'use strict';
import {config} from 'dotenv';
config();

// Import necessary modules and dependencies
import passport from 'passport';
import {Strategy} from 'passport-local';
import passportJWT from 'passport-jwt';
import UserModel from '../models/usermodel.js'; // Import the UserModel without '.js'
import jwt from 'jsonwebtoken';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Define a local strategy for email and password login
passport.use(
	new Strategy(async (email: string, _password, done: any) => {
		try {
			// Find a user in the database with the provided email
			const user: any = await UserModel.getAllUserInfo(email);

			// Check if the user exists
			console.log(email, 'IAWJDUOIAWDIOJAWD ');
			if (user === undefined) {
				return done(null, false, {message: 'Incorrect username.'});
			}

			return done(null, user, {message: 'Logged In Successfully'});
		} catch (err) {
			return done(err);
		}
	}),
);

// Define a JWT strategy for handling JSON Web Tokens
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET as string, // Assert process.env.JWT_SECRET as a string
		},
		(jwtPayload: any, done: Function) => {
			//console.log('JWTStrategy', jwtPayload); // Log the JWT payload
			done(null, jwtPayload); // Pass the JWT payload as the authenticated user
		},
	),
);

export interface User {
	username: string;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
}


export default passport; // Export passport as the default export
