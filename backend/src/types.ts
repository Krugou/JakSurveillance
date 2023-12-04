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
