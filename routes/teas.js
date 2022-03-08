/** @format */

/** Routes for teas */

const express = require("express");
const router = express.Router();

router.get("/", async function (req, res, next) {
  res.send("hello teas");
});

module.exports = router;

// const jsonschema = require("jsonschema");

// const express = require("express");
// const { BadRequestError } = require("../expressError");
// const { ensureUser } = require("../middleware/auth");
// const Tea = require("../models/tea");
// const teaNewSchema = require("../schemas/teaNew.json");
// const teaUpdateSchema = require("../schemas/teaUpdate.json");
// const teaSearchSchema = require("../schemas/teaSearch.json");

// const router = express.Router({ mergeParams: true });

/** GET / =>
 *       { teas: [ {id, title, brand, description }]}
 *
 * Authorization required: user
 *  */

// router.get("/", async function (req, res, next) {
//   const q = req.query;
//   return "yes!";

//   try {
//     const validator = jsonscehma.validate(q, teaSearchSchema);
//     if (!validator.valid) {
//       const errs = validator.errors.map((e) => e.stack);
//       throw new BadRequestError(errs);
//     }
//     const teas = await Tea.findAll(q);
//     return res.json({ teas });
//   } catch (err) {
//     return next(err);
//   }
// });
