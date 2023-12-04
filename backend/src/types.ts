import {NextFunction, Request, Response} from 'express';

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
export interface Item {
	__EMPTY: string;
	__EMPTY_1: string;
	__EMPTY_2: string;
	__EMPTY_3: string;
	__EMPTY_4: string;
	__EMPTY_5: string;
	__EMPTY_6: string;
	__EMPTY_7: string;
	__EMPTY_8: string;
	__EMPTY_9: string;
	[key: string]: string;
}
export interface Student {
	first_name: string;
	last_name: string;
	name: string;
	email: string;
	studentnumber: string;
	arrivalgroup: string;
	admingroups: string;
	program: string;
	educationform: string;
	registration: string;
	evaluation: string;
}
export interface CourseDetails {
	instructorEmail: string;
	startDate: Date;
	endDate: Date;
	studentGroup: string;
	courseName: string;
	courseCode: string;
	studentList: Student[];
}
export interface IData {
	realizations: {
		startDate: string;
		endDate: string;
		studentGroups: {
			code: string;
		}[];
	}[];
}
export interface CourseUser {
	role: string;
	email: string;
	userrole: number;
}
export interface DoneFunction {
	(
		error: null | Error,
		user?: false | User | undefined,
		options?: {message: string},
	): void;
}
export interface JwtPayload {
	[key: string]: unknown;
}

export interface DoneJwtFunction {
	(error: unknown, user?: JwtPayload): void;
}