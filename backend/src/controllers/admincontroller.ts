import createPool from '../config/createPool.js';
import ServerSettingsModel from '../models/serversettingsmodel.js';
import logger from '../utils/logger.js';
import { body, validationResult } from 'express-validator';

const pool = createPool('ADMIN');
/**
 * AdminController interface represents the structure of the admin controller.
 *
 * This interface provides the following methods:
 *
 * @method getServerSettings - Fetches the server settings from the database.
 * @method updateServerSettings - Updates the server settings in the database.
 */
export interface AdminController {
  /**
   * Gets the server settings.
   *
   * This method fetches the server settings from the database using the ServerSettingsModel.
   *
   * @returns {Promise<any>} A promise that resolves to the server settings.
   */
  getServerSettings: () => Promise<any>;
  /**
   * Updates the server settings.
   *
   * This method updates the server settings in the database using the ServerSettingsModel.
   *
   * @param {any} speedofhash - The speed of hash.
   * @param {any} leewayspeed - The leeway speed.
   * @param {any} timeouttime - The timeout time.
   * @param {any} attendancethreshold - The attendance threshold.
   * @returns {Promise<any>} A promise that resolves when the server settings have been updated.
   */
  updateServerSettings: (
    speedofhash: any,
    leewayspeed: any,
    timeouttime: any,
    attendancethreshold: any,
  ) => Promise<any>;
}
/**
 * `adminController` is an object that implements the AdminController interface.
 * It provides methods to get and update the server settings.
 *
 * @type {AdminController}
 */
const adminController: AdminController = {
  /**
   * Gets the server settings.
   *
   * @returns {Promise<any>} A promise that resolves to the server settings.
   */
  async getServerSettings() {
    try {
      const serverSettings = await ServerSettingsModel.getServerSettings(pool);
      return serverSettings; // use the serverSettings variable
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw error;
    }
  },
  /**
   * Updates the server settings.
   *
   * @param {any} speedofhash - The speed of hash.
   * @param {any} leewayspeed - The leeway speed.
   * @param {any} timeouttime - The timeout time.
   * @param {any} attendancethreshold - The attendance threshold.
   * @returns {Promise<any>} A promise that resolves when the server settings have been updated.
   */
  async updateServerSettings(
    speedofhash,
    leewayspeed,
    timeouttime,
    attendancethreshold,
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

      await ServerSettingsModel.updateServerSettings(
        pool,
        speedofhash,
        leewayspeed,
        timeouttime,
        attendancethreshold,
      );
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw error;
    }
  },
};

export default adminController;
