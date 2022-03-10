/** @format */

const express = require("express");
const router = express.Router();
const jsonschema = require("jsonschema");

const User = require("../models/user");
const userAuth = require("../schemas/userAuth.json");
const userRegister = require("../schemas/userRegister.json");
const { ensureLoggedIn } = require("../middleware/auth");

const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");

/** GET /auth  { userId } => { user }
 *
 * Returns { userId, username, firstName, lastName }
 *
 * Authorization required: ensureLoggedIn
 */

router.post("/auth", ensureLoggedIn, async function (req, res, next) {
  try {
    const user = await User.get(res.locals.user.userId);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userAuth);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, userRegister);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const newUser = await User.register({ ...req.body });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
