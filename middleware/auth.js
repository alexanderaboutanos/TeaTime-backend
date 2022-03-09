/** @format */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");
const User = require("../models/user");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

async function ensureTeaOwner(req, res, next) {
  try {
    const user = res.locals.user;
    const teaId = req.body.teaId || req.params.teaId;
    user.teaIdArr = await User.getMyTeas(user.userId);
    if (!(user && user.teaIdArr.indexOf(parseInt(teaId)) !== -1)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { ensureLoggedIn, ensureTeaOwner, authenticateJWT };
