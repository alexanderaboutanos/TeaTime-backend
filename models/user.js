/** @format */

const db = require("../db");
const bcrypt = require("bcrypt");

const { BadRequestError, UnauthorizedError } = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

// User class has two methods: authenticate user, and register new user.
class User {
  /** authenticate user with username, password.
   *
   * Returns { username, first_name, last_name }
   *
   * Throws UnauthorizedError is user not found or wrong password.
   **/

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT id, 
              username,
              password,
              first_name AS "firstName",
              last_name AS "lastName"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];
    user.teaIdArr = await User.getMyTeas(user.id);

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    // returns SQL data with array of teas.

    throw new UnauthorizedError("Invalid username/password");
  }

  /** Register user with data.
   *
   * Returns { username, firstName, lastName }
   *
   * Throws BadRequestError on duplicates.
   **/

  static async register({ username, password, firstName, lastName }) {
    const duplicateCheck = await db.query(
      `SELECT username
         FROM users
         WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username,
          password,
          first_name,
          last_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id, username, first_name AS "firstName", last_name AS "lastName"`,
      [username, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];

    user.teaIdArr = await User.getMyTeas(user.id);

    return user;
  }

  static async getMyTeas(userId) {
    const result = await db.query(
      `SELECT tea_id
         FROM saved_teas
         WHERE user_id = $1`,
      [userId]
    );
    const teaIdArr = result.rows.map((r) => r.tea_id);
    return teaIdArr;
  }
}

module.exports = User;
