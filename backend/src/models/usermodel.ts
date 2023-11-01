import { Pool, RowDataPacket } from 'mysql2/promise';
import pool from '../database/db.js'; // Adjust the path to your pool file

// Create a User Model object literal
const UserModel = {
  pool: pool,

  // A method to retrieve user information based on a username
  getAllUserInfo: async (username: string): Promise<UserInfo | null> => {
    try {
      const [rows] = await UserModel.pool.execute<RowDataPacket[]>(
        'SELECT * FROM users WHERE Username = ?',
        [username]
      );

      if (rows.length > 0) {
        return rows.pop();
      } else {
        return null;
      }
    } catch (error) {
      throw new Error('Database error');
    }
  },

  // For example, a method to update user information
  updateUserInfo: async (
    userId: number,
    newEmail: string
  ): Promise<boolean> => {
    try {
      // Execute an UPDATE query to change user's email
      const [result] = await UserModel.pool.execute(
        'UPDATE users SET Useremail = ? WHERE Userid = ?',
        [newEmail, userId]
      );

      // Check if the query was successful
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error');
    }
  },

  addUser: async (user: User): Promise<boolean> => {
    try {
      const { username, email, staff, first_name, last_name } = user;

      // Execute an INSERT query to add a new user to the database
      const [result] = await UserModel.pool.execute(
        'INSERT INTO users (username, email, staff, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
        [username, email, staff, first_name, last_name]
      );

      // Check if the query was successful
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error('Database error');
    }
  },
};

// Define the structure of the UserInfo object

/*
interface UserInfo {
  Userid: number;
  Useremail: string;
  Userrole: string;
  Username: string;
}
*/

interface User {
  username: string;
  email: string;
  staff: number;
  first_name: string;
  last_name: string;
}

export default UserModel;
