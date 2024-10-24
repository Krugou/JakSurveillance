import { Pool, RowDataPacket } from 'mysql2';
import logger from '../utils/logger.js';
import { body, validationResult } from 'express-validator';

// server settings model
const serverSettingsModel = {
  /**
   * Fetches server settings.
   * @param pool - The MySQL connection pool.
   * @returns A promise that resolves to an array of server settings.
   */
  async getServerSettings(pool: Pool) {
    try {
      return await pool
        .promise()
        .query<RowDataPacket[]>('SELECT * FROM serversettings');
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Updates server settings.
   * @param pool - The MySQL connection pool.
   * @param speedofhash - The speed of hash.
   * @param leewayspeed - The leeway speed.
   * @param timeouttime - The timeout time.
   * @param attendancethreshold - The attendance threshold.
   * @returns A promise that resolves to the result of the update.
   */
  async updateServerSettings(
    pool: Pool,
    speedofhash: number,
    leewayspeed: number,
    timeouttime: number,
    attendancethreshold: number,
  ) {
    try {
      // Validate input parameters
      await body('speedofhash').isNumeric().run();
      await body('leewayspeed').isNumeric().run();
      await body('timeouttime').isNumeric().run();
      await body('attendancethreshold').isNumeric().run();

      const errors = validationResult();
      if (!errors.isEmpty()) {
        throw new Error('Validation failed');
      }

      return await pool
        .promise()
        .query(
          'UPDATE serversettings SET speedofhash = ?, leewayspeed = ?, timeouttime = ?, attendancethreshold = ?',
          [speedofhash, leewayspeed, timeouttime, attendancethreshold],
        );
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Fetches the attendance threshold.
   * @param pool - The MySQL connection pool.
   * @returns A promise that resolves to the attendance threshold.
   */
  async getAttentanceThreshold(pool: Pool) {
    try {
      return await pool
        .promise()
        .query<RowDataPacket[]>(
          'SELECT attendancethreshold FROM serversettings',
        );
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
};

export default serverSettingsModel;
