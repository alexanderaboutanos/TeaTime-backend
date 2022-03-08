/** @format */

const db = require("../db");
// const { BadRequestError, NotFoundError } = require("../expressError");

class Tea {
  /** Create a tea (from data), update db, return new tea data.
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
}

module.exports = Tea;
