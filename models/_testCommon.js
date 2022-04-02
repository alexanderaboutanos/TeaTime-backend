/** @format */

const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM teas");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM saved_teas");
  await db.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE teas_id_seq RESTART WITH 1");
  await db.query("ALTER SEQUENCE saved_teas_id_seq RESTART WITH 1");

  await db.query(`
  INSERT INTO teas (title, brand, description, category, review, country_of_origin, organic, img_URL, brew_time, brew_temp)
  VALUES (
      'English Black Tea',
      'PG TIPS',
      'Fine English tea made from a reputable company.',
      'Black',
      'I have been drinking this tea for years now and I love it.',
      'England',
      'FALSE',
      'https://images.heb.com/is/image/HEBGrocery/000441976',
      '3',
      '100'),
      ('American Black Tea',
      'Lipton',
      'Classic American tea. Come and have a glass!',
      'Black',
      'We usually use this brand when making our southern ice cold sweet tea. Great!',
      'United States of America',
      'FALSE',
      'https://m.media-amazon.com/images/I/8187SPdp+IL._SL1500_.jpg',
      '3',
      '100');`);

  await db.query(
    `
    INSERT INTO users (username, password, first_name, last_name)
    VALUES ('testuser1',
            $1,
            'Test',
            'User1'),
           ('testuser2',
            $2,
            'Test',
            'User2');`,
    [
      await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(`
  INSERT INTO saved_teas (user_id, tea_id, is_my_tea, is_on_wish_list)
  VALUES (1, 1, TRUE, FALSE), (2, 2, FALSE, TRUE);`);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
