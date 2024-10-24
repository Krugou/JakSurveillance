import express, {NextFunction, Request, Response, Router} from 'express';
import {body, param} from 'express-validator';
import createPool from '../config/createPool.js';
import serverSettingsModel from '../models/serversettingsmodel.js';
import studentgroupmodel from '../models/studentgroupmodel.js';
import usercoursesModel from '../models/usercoursemodel.js';
import usermodel from '../models/usermodel.js';
import checkUserRole from '../utils/checkRole.js';
import logger from '../utils/logger.js';
import validate from '../utils/validate.js';

const pool = createPool('ADMIN');

/**
 * Router for secure routes.
 */
const router: Router = express.Router();

/**
 * Route that returns the user object from the request.
 */
router.get('/', (req: Request, res: Response) => {
  res.json(req.user);
});

/**
 * Route that fetches all students.
 */
router.get(
  '/students',
  checkUserRole(['admin', 'counselor', 'teacher']),
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const users = await usermodel.fetchAllStudents();
      res.send(users);
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

/**
 * Route that gets the attendance threshold.
 */
router.get(
  '/getattendancethreshold',
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const result = await serverSettingsModel.getAttentanceThreshold(pool); // replace with your actual function to get the threshold
      const threshold = result[0][0].attendancethreshold;
      res.send({attendancethreshold: threshold});
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

/**
 * Route that updates the GDPR status of a user.
 */
router.put(
  '/accept-gdpr/:userid',
  param('userid').isNumeric().withMessage('User ID must be a number'),
  validate,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const userId: number | undefined = req.user?.userid;
      await usermodel.updateUserGDPRStatus(userId);
      res.json({success: true});
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  },
);

/**
 * Route that checks if a user exists by email and is a staff member.
 */
router.get(
  '/check-staff/:email',
  checkUserRole(['admin', 'counselor', 'teacher']),
  param('email').isEmail().withMessage('Email must be a valid email address'),
  validate,
  async (req: Request, res: Response, _next: NextFunction) => {
    const email = req.params.email;
    try {
      const user = await usermodel.checkIfUserExistsByEmailAndisStaff(email);
      if (user.length > 0) {
        res.json({exists: true, user: user[0]});
      } else {
        res.json({exists: false});
      }
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

/**
 * Route that fetches all student groups.
 *
 * @returns {Promise<StudentGroup[]>} A promise that resolves with all student groups.
 */
router.get(
  '/studentgroups',
  checkUserRole(['admin', 'teacher', 'counselor']),
  async (_req: Request, res: Response, _next: NextFunction) => {
    try {
      const groups = await studentgroupmodel.fetchAllStudentGroups();
      res.send(groups);
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

router.post(
  '/insert-student-user-course/',
  checkUserRole(['admin', 'counselor', 'teacher']),
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('first_name').isString().withMessage('First name must be a string'),
    body('last_name').isString().withMessage('Last name must be a string'),
    body('studentnumber')
      .isString()
      .withMessage('Student number must be a string'),
    body('studentGroupId').isNumeric().withMessage('Student Group ID must be a number'),
    body('courseId').isNumeric().withMessage('Course ID must be a number')
  ],
  validate,
  async (req: Request, res: Response, _next: NextFunction) => {
    if (req.user) {
      console.log('insert-student-user-course ', req.user?.email);
      logger.info({email: req.user?.email}, 'Inserting student user');
    }
    const {
      email,
      first_name,
      last_name,
      studentnumber,
      studentGroupId,
      courseId,
    } = req.body;

    try {
      const existingUserByNumber =
        await usermodel.checkIfUserExistsByStudentNumber(studentnumber);
      if (existingUserByNumber.length > 0) {
        res
          .status(400)
          .json({message: 'User with this student number already exists'});
        return;
      }

      const existingUserByEmail = await usermodel.checkIfUserExistsByEmail(
        email,
      );
      if (existingUserByEmail.length > 0) {
        res.status(400).json({message: 'User with this email already exists'});
        return;
      }

      const userResult = await usermodel.insertStudentUser(
        email,
        first_name,
        last_name,
        studentnumber,
        studentGroupId,
      );

      // Check if course connection exists
      const existingUserCourse = await usercoursesModel.checkIfUserCourseExists(
        userResult.insertId,
        courseId,
      );
      if (existingUserCourse.length === 0) {
        // If course connection does not exist, add it
        await usercoursesModel.insertUserCourse(userResult.insertId, courseId);
      }

      res
        .status(200)
        .send({message: 'Student user inserted successfully', userResult});
      console.log(
        `Student user successfully inserted. Email: ${email}, Student Number: ${studentnumber}`,
      );
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

router.put(
  '/updateuser',
  checkUserRole(['admin', 'counselor', 'teacher']),
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const user = req.body;
      await usermodel.updateUser(user);
      res.send({message: 'User updated successfully'});
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

/**
 * Route that fetches a user by their ID.
 *
 * @param {number} userid - The ID of the user.
 * @returns {Promise<User>} A promise that resolves with the user.
 */
router.get(
  '/getuser/:userid',
  checkUserRole(['admin', 'counselor', 'teacher']),
  [param('userid').isNumeric().withMessage('User ID must be a number')],
  validate,
  async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const {userid} = req.params;
      const user = await usermodel.fetchUserById(Number(userid));
      res.send(user);
    } catch (error) {
      logger.error(error);
      console.error(error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
);

export default router;
