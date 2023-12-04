import {config} from 'dotenv';
import passport from 'passport';
import passportJWT, {StrategyOptions, VerifiedCallback} from 'passport-jwt';
import {IVerifyOptions, Strategy as LocalStrategy} from 'passport-local';
import UserModel from '../models/usermodel.js';
import {User} from '../types.js';
// Load environment variables
config();

// Define JWT Strategy and Extractor
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

/**
 * Use Local Strategy for authentication.
 * This strategy is used for the initial login.
 * @returns {void}
 */
passport.use(
	new LocalStrategy(
		async (
			email: string,
			_password: string,
			done: (
				error: Error | null,
				user?: User | false,
				options?: IVerifyOptions,
			) => void,
		) => {
			try {
				// Get user info from the UserModel
				const user = (await UserModel.getAllUserInfo(email)) as User;

				// If user is not found, return with a message
				if (user === undefined) {
					return done(null, false, {message: 'Incorrect username.'});
				}

				// If user is found, return with the user object
				return done(null, user, {message: 'Logged In Successfully'});
			} catch (err) {
				// If there's an error, return with the error
				return done(err as Error);
			}
		},
	),
);

// Define JWT options
const jwtOptions: StrategyOptions = {
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET as string,
};

/**
 * Use JWT Strategy for authentication.
 * This strategy is used for subsequent requests after login.
 * @returns {void}
 */
passport.use(
	new JWTStrategy(jwtOptions, (jwtPayload: User, done: VerifiedCallback) => {
		// Return with the JWT payload
		done(null, jwtPayload);
	}),
);

export default passport;
