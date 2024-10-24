import {RowDataPacket} from 'mysql2';
import createPool from '../config/createPool.js';
import logger from '../utils/logger.js';

const pool = createPool('ADMIN');
/**
 * Role interface.
 */
interface Role {
  roleid: number;
  rolename: string;
  // other fields...
}

/**
 * RoleModel interface.
 */
interface RoleModel {
  /**
   * Finds a role by its ID.
   * @param id - The ID of the role.
   * @returns A promise that resolves to the role or null if not found.
   */
  findByRoleId(id: number): Promise<Role | null>;

  /**
   * Inserts a new role.
   * @param rolename - The name of the role.
   * @returns A promise that resolves when the insertion is complete.
   */
  insertIntoRole(rolename: string): Promise<void>;

  /**
   * Fetches roles for teachers and counselors.
   * @returns A promise that resolves to an array of roles.
   */
  fetchTeacherAndCounselorRoles(): Promise<RowDataPacket[]>;

  /**
   * Fetches all roles.
   * @returns A promise that resolves to an array of all roles.
   */
  fetchAllRoles(): Promise<RowDataPacket[]>;

  // other methods...
}
const roleModel: RoleModel = {
  /**
   * Fetches all roles.
   * @returns A promise that resolves to an array of all roles.
   */
  async fetchAllRoles() {
    try {
      const [results] = await pool
        .promise()
        .query<RowDataPacket[]>('SELECT * FROM roles');
      return results;
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Fetches roles for teachers and counselors.
   * @returns A promise that resolves to an array of roles.
   */
  async fetchTeacherAndCounselorRoles() {
    try {
      const [rows] = await pool
        .promise()
        .query<RowDataPacket[]>(
          "SELECT * FROM roles WHERE name IN ('teacher', 'counselor')",
        );
      return rows;
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Finds a role by its ID.
   * @param id - The ID of the role.
   * @returns A promise that resolves to the role or null if not found.
   */
  async findByRoleId(id) {
    try {
      const [rows] = await pool
        .promise()
        .query<RowDataPacket[]>('SELECT * FROM roles WHERE roleid = ?', [id]);
      return (rows[0] as Role) || null;
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },
  /**
   * Inserts a new role.
   * @param rolename - The name of the role.
   * @returns A promise that resolves when the insertion is complete.
   */
  async insertIntoRole(rolename) {
    try {
      await pool
        .promise()
        .query('INSERT INTO roles (rolename) VALUES (?)', [rolename]);
    } catch (error) {
      console.error(error);
      logger.error(error);
      return Promise.reject(error);
    }
  },

  // other methods...
};

export default roleModel;
