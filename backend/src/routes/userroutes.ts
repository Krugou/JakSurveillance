import express, {NextFunction, Request, Response, Router} from 'express';
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';
import userFeedBackModel from '../models/userfeedbackmodel.js';
import usermodel from '../models/usermodel.js';
import {ResponseData, User, UserData} from '../types.js';
import {authenticate} from '../utils/auth.js';
import doFetch from '../utils/doFetch.js';
import logger from '../utils/logger.js';

const loginUrl = 'https://streams.metropolia.fi/2.0/api/';

/**
 * Router for user routes.
 */
const router: Router = express.Router();

/**
 * Route that handles user login.
 * If the user is a staff member and doesn't exist in the database, they are added.
 * If the user is a staff member and exists in the database, their login is authenticated.
 * If the user is not a staff member, their login is authenticated.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} A promise that resolves when the operation is finished.
 */
router.post(
  '/',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if the environment variables are not undefined
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set');
      }

      if (
        !process.env.devaccount ||
        !process.env.devpass ||
        !process.env.devteacheraccount ||
        !process.env.devteacherpass ||
        !process.env.devstudentaccount ||
        !process.env.devstudentpass ||
        !process.env.devstudent2account ||
        !process.env.devstudent2pass ||
        !process.env.devcounseloraccount ||
        !process.env.devcounselorpass
      ) {
        throw new Error('One or more environment variables are not set');
      }

      let metropoliaData: ResponseData;
      // Get username and password from the request body
      const {username, password} = req.body;

      // create tokens for dev accounts and return them
      if (
        username === process.env.devaccount &&
        password === process.env.devpass
      ) {
        metropoliaData = {
          staff: true,
          user: process.env.devaccount,
          firstname: 'Gustav',
          lastname: 'Admin',
          email: 'admin@metropolia.fi',
        };
      } else if (
        username === process.env.devteacheraccount &&
        password === process.env.devteacherpass
      ) {
        metropoliaData = {
          staff: true,
          user: process.env.devteacheraccount,
          firstname: 'Willie',
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
          firstname: 'Sam',
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
          firstname: 'Laurel',
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
          firstname: 'Cass',
          lastname: 'Counselor',
          email: 'counselor@metropolia.fi',
        };
      } else {
        // Try to find user in Metropolia database
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, password}),
        };
        metropoliaData = await doFetch(loginUrl, options);

        if (metropoliaData.message === 'invalid username or password') {
          res.status(403).json({
            message: 'Invalid username or password',
          });
          return;
        }
      }

      req.body.username = metropoliaData.email;
      // If the logged-in user is Metropolia staff and they don't exist in the DB yet, add them to the DB
      if (metropoliaData.staff === true) {
        try {
          // Check if the user exists in the database
          const userFromDB: unknown = await usermodel.getAllUserInfo(
            metropoliaData.email,
          );
          // dev purposes only change back to teacher only default when in production
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
          const userData: UserData = {
            username: metropoliaData.user,
            staff: 1,
            first_name: metropoliaData.firstname,
            last_name: metropoliaData.lastname,
            email: metropoliaData.email,
            roleid: roleid,
          };

          if (userFromDB === null) {
            // If the staff user doesn't exist, add them to the database
            const addStaffUserResponse = await usermodel.addStaffUser(userData);
            if (!addStaffUserResponse) {
              logger.error('Failed to add staff user to the database.');
              console.error('Failed to add staff user to the database.');
            }
            // Create a token for the user
            const token = jwt.sign(
              addStaffUserResponse as User,
              process.env.JWT_SECRET as string,
              {
                expiresIn: '2h',
              },
            );
            // Send the user and the token in the response
            if (addStaffUserResponse === null) {
              throw new Error('Failed to add staff user');
            }
            res.json({user: addStaffUserResponse, token});
          } else {
            if (username !== 'admin') {
              logger.info(
                `Staff Metropolia API login was successful for user: ${username}`,
              );
              console.log(
                `Staff Metropolia API login was successful for user: ${username}`,
              );
            }
            // If the staff user exists, authenticate their login
            authenticate(req, res, next, username);
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({error: 'Internal server error'});
        }
      }

      // If the logged-in user is not Metropolia staff, authenticate them
      if (metropoliaData.staff === false) {
        // Call the authenticate function to handle passport authentication
        logger.info(
          `Non-staff Metropolia API login was successful for user: ${username}`,
        );
        console.log(
          `Non-staff Metropolia API login was successful for user: ${username}`,
        );
        authenticate(req, res, next, username);
      }
    } catch (error) {
      console.log('Error in user login: ');
      logger.error(error);
      console.error(error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

router.post(
  '/feedback',
  [
    body('topic').notEmpty().withMessage('Topic is required'),
    body('text').notEmpty().withMessage('Text is required'),
    body('userId').notEmpty().withMessage('User ID is required'),
  ],
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({errors: errors.array()});
        return;
      }
      const {topic, text, userId} = req.body;

      const result = await userFeedBackModel.insertUserFeedback(
        userId,
        topic,
        text,
      );
      if (result === null) {
        res.status(500).json({
          message: 'Internal server error',
        });
        return;
      }
      res.status(200).json({
        message: 'Success',
      });
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({
        message: 'An unexpected error occurred',
      });
    }
  },
);

export default router;
