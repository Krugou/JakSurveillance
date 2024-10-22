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
/**
 * Interface for the response data object.
 * @interface
 * @property {string} message - The message of the response
 * @property {boolean} staff - The staff status of the user
 * @property {string} user - The username of the user
 * @property {string} firstname - The first name of the user
 * @property {string} lastname - The last name of the user
 * @property {string} email - The email of the user
 * @export
 */
export interface ResponseData {
  message?: string;
  staff: boolean;
  user: string;
  firstname: string;
  lastname: string;
  email: string;
}

/**
 * Interface for the user data object.
 * @interface
 * @property {string} username - The username of the user
 * @property {number} staff - The staff number of the user
 * @property {string} first_name - The first name of the user
 * @property {string} last_name - The last name of the user
 * @property {string} email - The email of the user
 * @property {number} roleid - The role id of the user
 * @export
 */
export interface UserData {
  username: string;
  staff: number;
  first_name: string;
  last_name: string;
  email: string;
  roleid: number;
}

/**
 * Interface for the item object.
 * @interface
 * @property {string} __EMPTY - The first property of the item
 * @property {string} __EMPTY_1 - The second property of the item
 * @property {string} __EMPTY_2 - The third property of the item
 * @property {string} __EMPTY_3 - The fourth property of the item
 * @property {string} __EMPTY_4 - The fifth property of the item
 * @property {string} __EMPTY_5 - The sixth property of the item
 * @property {string} __EMPTY_6 - The seventh property of the item
 * @property {string} __EMPTY_7 - The eighth property of the item
 * @property {string} __EMPTY_8 - The ninth property of the item
 * @property {string} __EMPTY_9 - The tenth property of the item
 * @property {string} [key: string] - The key-value pairs of the item
 * @export
 */
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
/**
 * Interface for the student object.
 * @interface
 * @property {string} first_name - The first name of the student
 * @property {string} last_name - The last name of the student
 * @property {string} name - The full name of the student
 * @property {string} email - The email of the student
 * @property {string} studentnumber - The student number
 * @property {string} arrivalgroup - The arrival group of the student
 * @property {string} admingroups - The admin groups the student belongs to
 * @property {string} program - The program the student is enrolled in
 * @property {string} educationform - The form of education the student is following
 * @property {string} registration - The registration status of the student
 * @property {string} evaluation - The evaluation status of the student
 * @export
 */
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

/**
 * Interface for the course details object.
 * @interface
 * @property {string} instructorEmail - The email of the instructor
 * @property {Date} startDate - The start date of the course
 * @property {Date} endDate - The end date of the course
 * @property {string} studentGroup - The student group for the course
 * @property {string} courseName - The name of the course
 * @property {string} courseCode - The code of the course
 * @property {Student[]} studentList - The list of students in the course
 * @export
 */
export interface CourseDetails {
  instructorEmail: string;
  startDate: Date;
  endDate: Date;
  studentGroup: string;
  courseName: string;
  courseCode: string;
  studentList: Student[];
}
/**
 * Interface for the data object.
 * @interface
 * @property {Object[]} realizations - The realizations of the data
 * @property {string} realizations.startDate - The start date of the realization
 * @property {string} realizations.endDate - The end date of the realization
 * @property {Object[]} realizations.studentGroups - The student groups of the realization
 * @property {string} realizations.studentGroups.code - The code of the student group
 * @export
 */
export interface IData {
  realizations: {
    startDate: string;
    endDate: string;
    studentGroups: {
      code: string;
    }[];
  }[];
}

/**
 * Interface for the course user object.
 * @interface
 * @property {string} role - The role of the user
 * @property {string} email - The email of the user
 * @property {number} userrole - The user role id of the user
 * @export
 */
export interface CourseUser {
  role: string;
  email: string;
  userrole: number;
  userid: number;
}

/**
 * Interface for the done function.
 * @interface
 * @property {Function} - The done function
 * @property {null | Error} error - The error object
 * @property {false | User | undefined} user - The user object
 * @property {Object} options - The options object
 * @property {string} options.message - The message of the options
 * @export
 */
export interface DoneFunction {
  (
    error: null | Error,
    user?: false | User | undefined,
    options?: {message: string},
  ): void;
}

/**
 * Interface for the JWT payload object.
 * @interface
 * @property {string} [key: string] - The key-value pairs of the JWT payload
 * @export
 */
export interface JwtPayload {
  [key: string]: unknown;
}

/**
 * Interface for the done JWT function.
 * @interface
 * @property {Function} - The done JWT function
 * @property {unknown} error - The error object
 * @property {JwtPayload} user - The JWT payload object
 * @export
 */
export interface DoneJwtFunction {
  (error: unknown, user?: JwtPayload): void;
}
