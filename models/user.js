/** @format */

const db = require("../db");
const bcrypt = require("bcrypt");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /** Given a userId, return data about user.
   *
   * Returns { userId, username, firstName, lastName }
   *
   * Throws NotFoundError if user not found.
   **/

  static async get(userId) {
    const userRes = await db.query(
      `SELECT id,
              username,
              first_name,
              last_name
             FROM users
             WHERE id = $1`,
      [userId]
    );
    const user = userRes.rows[0];
    if (!user) throw new NotFoundError(`No user: id#${userId}`);
    return user;
  }

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

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

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

    return user;
  }

  /** Returns an array with all the teas that are on a user's wishList or 'myTea' folder. */

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
