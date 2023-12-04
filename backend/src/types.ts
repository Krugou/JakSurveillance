import {Request, Response, NextFunction} from 'express';

/**
 * User interface for the user object.
 * @interface
 * @property {string} username - The username of the user
 * @property {string} email - The email of the user
 * @property {number} staff - The staff number of the user
 * @property {string} first_name - The first name of the user
 * @property {string} last_name - The last name of the user
 */
export interface User {
	username: string;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
}
export interface AuthenticateParams {
	req: Request;
	res: Response;
	next: NextFunction;
	newUsername: string;
}

export interface AuthenticateCallbackParams {
	err: Error;
	user: User;
	_info: unknown;
}

export interface ResponseData {
	message?: string;
	staff: boolean;
	user: string;
	firstname: string;
	lastname: string;
	email: string;
}

export interface UserData {
	username: string;
	staff: number;
	first_name: string;
	last_name: string;
	email: string;
	roleid: number;
}
