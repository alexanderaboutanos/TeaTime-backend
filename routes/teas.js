/** @format */

/** Routes for teas */

const express = require("express");
const router = express.Router();

const Tea = require("../models/tea");

const jsonschema = require("jsonschema");
const teaNewSchema = require("../schemas/teaNew.json");
// const teaUpdateSchema = require("../schemas/teaUpdate.json");
// const teaSearchSchema = require("../schemas/teaSearch.json");

const { BadRequestError } = require("../expressError");
const ensureLoggedIn = require("../middleware/auth");

/** POST / { tea } =>  { tea }
 *
 * CREATES NEW TEA
 *
 * tea should be { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: user
 */

router.post("/new", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, teaNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const tea = await Tea.create(req.body);
    return res.status(201).json({ tea });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
