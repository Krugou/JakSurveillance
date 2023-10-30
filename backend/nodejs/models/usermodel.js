import pool from '../database/db.js'; // Adjust the path to your pool file
// Create a class for the user model
class UserModel {
    pool;
    // Constructor to initialize the database pool
    constructor(pool) {
        this.pool = pool;
    }
    // A method to retrieve user information based on a username
    async getAllUserInfo(username) {
        try {
            // Execute a SELECT query to fetch user information
            const [rows] = await this.pool.execute('SELECT * FROM users WHERE Username = ?', [username]);
            // Check if the query returned any rows
            if (rows.length > 0) {
                console.log(rows);
                /*
                // Construct a UserInfo object from the query result
                const userInfo: UserInfo = {
                  Userid: rows[0].Userid as number,
                  Useremail: rows[0].Useremail as string,
                  Userrole: rows[0].Userrole as string,
                  Username: rows[0].Username as string,
                };
                return userInfo; // Return the user information
                */
                return rows.pop();
            }
            else {
                return null; // Return null if the user is not found
            }
        }
        catch (error) {
            throw new Error('Database error'); // Throw an error if there's a database error
        }
    }
}
// Define the structure of the UserInfo object
/*
interface UserInfo {
  Userid: number;
  Useremail: string;
  Userrole: string;
  Username: string;
}
*/
export default new UserModel(pool); // Export an instance of the UserModel
