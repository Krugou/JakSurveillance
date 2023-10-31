import pool from '../database/db.js'; // Adjust the path to your pool file
// Create a User Model object literal
const UserModel = {
    pool: pool,
    // A method to retrieve user information based on a username
    getAllUserInfo: async (username) => {
        try {
            const [rows] = await UserModel.pool.execute('SELECT * FROM users WHERE Username = ?', [username]);
            if (rows.length > 0) {
                return rows.pop();
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw new Error('Database error');
        }
    },
    // For example, a method to update user information
    updateUserInfo: async (userId, newEmail) => {
        try {
            // Execute an UPDATE query to change user's email
            const [result] = await UserModel.pool.execute('UPDATE users SET Useremail = ? WHERE Userid = ?', [newEmail, userId]);
            // Check if the query was successful
            return result.affectedRows > 0;
        }
        catch (error) {
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
export default UserModel;
