/** @format */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

/** Use development database, testing database, or via env var, production database */
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "tea_time_test"
    : process.env.DATABASE_URL || "tea_time";
}

/** Speed up bcrypt during tests */
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("TeaTime Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
