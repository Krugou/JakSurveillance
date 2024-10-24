import {RowDataPacket} from 'mysql2';
import attendanceModel from '../models/attendancemodel.js';
import lectureModel from '../models/lecturemodel.js';
import usercoursesModel from '../models/usercoursemodel.js';
import logger from '../utils/logger.js';
import { body, validationResult } from 'express-validator';

/**
 * AttendanceController interface represents the structure of the attendance controller.
 *
 * This interface provides the following methods:
 *
 * @method insertIntoAttendance - Inserts a new attendance record.
 * @method checkAndInsertStatusNotPresentAttendance - Checks and inserts attendance records for students not present.
 * @method getLecturesAndAttendancesByCourseId - Gets lectures and attendances by course ID.
 * @method updateAttendanceStatus - Updates the attendance status.
 * @method deleteAttendance - Deletes an attendance record.
 */
export interface AttendanceController {
  /**
   * Inserts a new attendance record.
   *
   * @param {string} status - The attendance status.
   * @param {string} date - The date of the lecture.
   * @param {string} studentnumber - The student number.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance record has been inserted.
   */
  insertIntoAttendance: (
    status: string,
    date: string,
    studentnumber: string,
    lectureid: string,
  ) => Promise<unknown>;
  /**
   * Checks and inserts attendance records for students not present.
   *
   * @param {string} date - The date of the lecture.
   * @param {string[]} studentnumbers - The student numbers.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance records have been inserted.
   */
  checkAndInsertStatusNotPresentAttendance: (
    date: string,
    studentnumbers: string[],
    lectureid: string,
  ) => Promise<unknown>;

  /**
   * Gets lectures and attendances by course ID.
   *
   * @param {string} courseid - The course ID.
   * @returns {Promise<unknown>} A promise that resolves to the lectures and attendances.
   */
  getLecturesAndAttendancesByCourseId: (courseid: string) => Promise<unknown>;
  /**
   * Updates the attendance status.
   *
   * @param {number} attendanceid - The attendance ID.
   * @param {number} status - The new attendance status.
   * @returns {Promise<unknown>} A promise that resolves when the attendance status has been updated.
   */
  updateAttendanceStatus: (
    attendanceid: number,
    status: number,
  ) => Promise<unknown>;
  /**
   * Deletes an attendance record.
   *
   * @param {string} studentnumber - The student number.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance record has been deleted.
   */
  deleteAttendance: (
    studentnumber: string,
    lectureid: string,
  ) => Promise<unknown>;
}

/**
 * `attendanceController` is an object that implements the AttendanceController interface.
 * It provides methods to manage attendance records.
 *
 * @type {AttendanceController}
 */
const attendanceController: AttendanceController = {
  /**
   * Inserts a new attendance record.
   *
   * @param {string} status - The attendance status.
   * @param {string} date - The date of the lecture.
   * @param {string} studentnumber - The student number.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance record has been inserted.
   */
  async insertIntoAttendance(
    status: string,
    date: string,
    studentnumber: string,
    lectureid: string,
  ): Promise<unknown> {
    try {
      logger.info('Starting insertIntoAttendance operation');
      if (!status || !date || !studentnumber || !lectureid) {
        throw new Error('Invalid parameters');
      }

      // Validate input parameters
      await body('status').isNumeric().run();
      await body('date').isISO8601().run();
      await body('studentnumber').isNumeric().run();
      await body('lectureid').isNumeric().run();

      const errors = validationResult();
      if (!errors.isEmpty()) {
        throw new Error('Validation failed');
      }

      const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
      if (courseId === null) {
        throw new Error('Course ID is null');
      }
      const usercourseResult = await usercoursesModel.getUserCourseId(
        studentnumber,
        courseId,
      );

      if (!Array.isArray(usercourseResult) || usercourseResult.length === 0) {
        throw new Error(
          `Usercourse not found for the studentnumber: ${studentnumber}`,
        );
      }

      if ('usercourseid' in usercourseResult[0]) {
        const usercourseid = usercourseResult[0].usercourseid;
        const attendanceResultCheck = await attendanceModel.checkAttendance(
          usercourseid,
          Number(lectureid),
        );

        if (!attendanceResultCheck || attendanceResultCheck.length > 0) {
          throw new Error(
            `Attendance already exists for the usercourseid: ${usercourseid}`,
          );
        }

        const insertResult = await attendanceModel.insertAttendance(
          Number(status),
          date,
          usercourseid,
          lectureid,
        );

        if (!insertResult || !insertResult[0] || !insertResult[0].insertId) {
          throw new Error('Failed to insert attendance');
        }

        const attendanceResult = await attendanceModel.getAttendanceById(
          insertResult[0].insertId,
        );

        if (!attendanceResult || attendanceResult.length === 0) {
          throw new Error(
            `Failed to get attendance by id: ${insertResult.insertId}`,
          );
        }

        logger.info('Completed insertIntoAttendance operation');
        return attendanceResult[0];
      } else {
        throw new Error('Invalid result: usercourseid property not found');
      }
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw error;
    }
  },
  /**
   * Checks and inserts attendance records for students not present.
   *
   * @param {string} date - The date of the lecture.
   * @param {string[]} studentnumbers - The student numbers.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance records have been inserted.
   */
  async checkAndInsertStatusNotPresentAttendance(
    date: string,
    studentnumbers: string[],
    lectureid: string,
  ): Promise<void> {
    try {
      logger.info('Starting checkAndInsertStatusNotPresentAttendance operation');
      for (const studentnumber of studentnumbers) {
        const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
        if (courseId === null) {
          console.error('Course ID is null');
          continue;
        }

        const usercourseResult = (await usercoursesModel.getUserCourseId(
          studentnumber,
          courseId,
        )) as RowDataPacket[];

        if (usercourseResult.length === 0) {
          console.error(
            'Usercourse not found for the studentnumber:',
            studentnumber,
          );
          continue;
        }

        const usercourseid = usercourseResult[0].usercourseid;

        const attendanceResult =
          await attendanceModel.getAttendanceByUserCourseIdDateLectureId(
            usercourseid,
            lectureid,
          );

        if (attendanceResult.length === 0) {
          const status = 0;
          await attendanceModel.insertAttendance(
            status,
            date,
            usercourseid,
            lectureid,
          );
        }
      }
      logger.info('Completed checkAndInsertStatusNotPresentAttendance operation');
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Updates the attendance status.
   *
   * @param {number} attendanceid - The attendance ID.
   * @param {number} status - The new attendance status.
   * @returns {Promise<unknown>} A promise that resolves when the attendance status has been updated.
   */
  async updateAttendanceStatus(attendanceid: number, status: number) {
    try {
      logger.info('Starting updateAttendanceStatus operation');
      await attendanceModel.updateAttendanceStatus(attendanceid, status);
      logger.info('Completed updateAttendanceStatus operation');
      return true;
    } catch (error) {
      console.error(error);
      logger.error(error);
      return false;
    }
  },
  /**
   * Gets lectures and attendances by course ID.
   *
   * @param {string} courseid - The course ID.
   * @returns {Promise<unknown>} A promise that resolves to the lectures and attendances.
   */
  async getLecturesAndAttendancesByCourseId(courseid: string) {
    try {
      logger.info('Starting getLecturesAndAttendancesByCourseId operation');
      const lectures = await attendanceModel.getAttendaceByCourseId(courseid);
      logger.info('Completed getLecturesAndAttendancesByCourseId operation');
      return lectures;
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Deletes an attendance record.
   *
   * @param {string} studentnumber - The student number.
   * @param {string} lectureid - The lecture ID.
   * @returns {Promise<unknown>} A promise that resolves when the attendance record has been deleted.
   */
  async deleteAttendance(
    studentnumber: string,
    lectureid: string,
  ): Promise<boolean> {
    try {
      logger.info('Starting deleteAttendance operation');
      const courseId = await lectureModel.getCourseIDByLectureID(lectureid);
      if (courseId === null) {
        throw new Error('Course ID is null');
      }
      const usercourseResult = await usercoursesModel.getUserCourseId(
        studentnumber,
        courseId,
      );

      if (!Array.isArray(usercourseResult) || usercourseResult.length === 0) {
        throw new Error(
          `Usercourse not found for the studentnumber: ${studentnumber}`,
        );
      }
      if ('usercourseid' in usercourseResult[0]) {
        const usercourseid = usercourseResult[0].usercourseid;

        const deleteResult = await attendanceModel.deleteAttendance(
          usercourseid,
          Number(lectureid),
        );

        if (!deleteResult || deleteResult.affectedRows === 0) {
          throw new Error('Failed to delete attendance');
        }

        logger.info('Completed deleteAttendance operation');
        return true;
      } else {
        throw new Error('Invalid result: usercourseid property not found');
      }
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
};

export default attendanceController;
