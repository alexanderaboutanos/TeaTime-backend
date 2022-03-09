/** @format */

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Tea {
  /**
   *
   * GET TEA
   *
   * Given a tea_id, return data about tea.
   *
   * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const teaRes = await db.query(
      `SELECT *
         FROM teas
         WHERE id = $1`,
      [id]
    );
    const tea = teaRes.rows[0];
    if (!tea) throw new NotFoundError(`No tea with id#: ${id}`);
    return tea;
  }

  /**
   *
   * CREATE TEA
   *
   * Create a tea (from data), update db, return new tea data.
   *
   * data should be { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
   *
   * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
   *
   * */

  static async create({
    title,
    brand,
    description,
    category,
    review,
    country_of_origin,
    organic,
    img_url,
    brew_time,
    brew_temp,
  }) {
    const result = await db.query(
      `INSERT INTO teas
           (title,
            brand,
            description,
            category,
            review,
            country_of_origin,
            organic,
            img_url,
            brew_time,
            brew_temp)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING 
            id, 
            title,
            brand,
            description,
            category,
            review,
            country_of_origin,
            organic,
            img_url,
            brew_time,
            brew_temp`,
      [
        title,
        brand,
        description,
        category,
        review,
        country_of_origin,
        organic,
        img_url,
        brew_time,
        brew_temp,
      ]
    );
    const tea = result.rows[0];

    return tea;
  }

  /** Update tea data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
   *
   * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE teas 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp`;
    const result = await db.query(querySql, [...values, id]);
    const tea = result.rows[0];

    if (!tea) throw new NotFoundError(`No tea: ${id}`);

    return tea;
  }

  /**
   *
   * DELETE TEA
   *
   * Delete given tea from database; returns undefined.
   *
   * Throws NotFoundError if tea not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM teas
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const tea = result.rows[0];
    if (!tea) throw new NotFoundError(`No tea with id#: ${id}`);
  }
}

module.exports = Tea;
