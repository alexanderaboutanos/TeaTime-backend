/** @format */

/** Routes for teas */

const express = require("express");
const router = express.Router();

const Tea = require("../models/tea");

const jsonschema = require("jsonschema");
const teaNewSchema = require("../schemas/teaNew.json");
// const teaUpdateSchema = require("../schemas/teaUpdate.json");

const { BadRequestError } = require("../expressError");
const ensureLoggedIn = require("../middleware/auth");

/** GET /[id]  =>  { tea }
 *
 * GET TEA DATA
 *
 * Get information about a tea with just the id
 *
 *  Tea is { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: loggedIn
 */

router.get("/:id", async function (req, res, next) {
  try {
    const tea = await Tea.get(req.params.id);
    return res.json({ tea });
  } catch (err) {
    return next(err);
  }
});

/** POST / { tea } =>  { tea }
 *
 * CREATES NEW TEA
 *
 * tea should be { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: loggedIn
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

/** DELETE /[id]  =>  { deleted: id }
 *
 * DELETES TEA
 *
 * Authorization: EnsureOwnerOfTea(wishList or myTea)
 */

router.delete("/:id", async function (req, res, next) {
  try {
    await Tea.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
