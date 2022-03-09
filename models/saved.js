/** @format */

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class Saved {
  /**
   *
   * SAVE A TEA
   *
   * update db, returns undefined.
   *
   * - user_id: user_id who created the tea.
   * - tea_id: tea id
   **/

  static async addToSavedTeas(userId, teaId, isMyTea, isWishList) {
    const preCheck = await db.query(
      `SELECT id
           FROM teas
           WHERE id = $1`,
      [teaId]
    );
    const tea = preCheck.rows[0];

    if (!tea) throw new NotFoundError(`No tea: ${teaId}`);

    const preCheck2 = await db.query(
      `SELECT id
           FROM users
           WHERE id = $1`,
      [userId]
    );
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No user id: ${userId}`);

    // ensure they are not the same value
    if (isMyTea == isWishList) {
      throw new BadRequestError("Cannot save this tea!");
    }

    await db.query(
      `INSERT INTO saved_teas (user_id, tea_id, is_my_tea, is_on_wish_list)
           VALUES ($1, $2, $3, $4)`,
      [userId, teaId, isMyTea, isWishList]
    );
  }

  /**
   *
   * DELETE SAVED TEA
   *
   * Delete relationship from database; returns undefined.
   *
   * Throws NotFoundError if saved_tea_relationship not found.
   **/

  static async remove(teaId) {
    const result = await db.query(
      `DELETE
           FROM saved_teas
           WHERE tea_id = $1
           RETURNING id`,
      [teaId]
    );
    const savedTea = result.rows[0];
    if (!savedTea) {
      throw new NotFoundError(`No saved tea with tea id#: ${Teaid}`);
    }
  }
}

module.exports = Saved;
