/** @format */

/** Routes for teas */

const express = require("express");
const router = express.Router();

const Tea = require("../models/tea");
const Saved = require("../models/saved");

const jsonschema = require("jsonschema");
const teaNewSchema = require("../schemas/teaNew.json");
const teaEditSchema = require("../schemas/teaEdit.json");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureTeaOwner } = require("../middleware/auth");

/** GET /my-teas  =>  { [tea1, tea2...] }
 *
 * GET ALL MY TEAS
 *
 * returns an array of all my teas
 *
 *  where each tea is { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: ensureLoggedIn
 */

router.get("/my-teas", ensureLoggedIn, async function (req, res, next) {
  try {
    const { userId } = res.locals.user;
    const myTeaArr = await Tea.findAll(userId, true, false);
    return res.json({ myTeaArr });
  } catch (err) {
    return next(err);
  }
});

/** GET /wish-list  =>  { [tea1, tea2...] }
 *
 * GET ALL TEAS ON WISH LIST
 *
 * returns an array of all the teas on my wish  List
 *
 *  where each tea is { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: ensureLoggedIn
 */

router.get("/wish-list", ensureLoggedIn, async function (req, res, next) {
  try {
    const { userId } = res.locals.user;
    const wishListArr = await Tea.findAll(userId, false, true);
    return res.json({ wishListArr });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { tea }
 *
 * GET TEA DATA
 *
 * Get information about a tea with just the id
 *
 *  Tea is { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: ensureTeaOwner
 */

router.get("/:teaId", ensureTeaOwner, async function (req, res, next) {
  try {
    const tea = await Tea.get(req.params.teaId);
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

router.post("/new", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, teaNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const tea = await Tea.create(req.body);

    const { is_my_tea, is_wish_list } = req.body;

    const savedTea = await Saved.addToSavedTeas(
      res.locals.user.userId,
      tea.id,
      is_my_tea,
      is_wish_list
    );
    return res.status(201).json({ tea });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[teaId]  { fld1, fld2, ... } => { tea }
 *
 * Data can include: title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp
 *
 * Returns { title, brand, description, category, review, country_of_origin, organic, img_url, brew_time, brew_temp }
 *
 * Authorization required: ensureTeaOwner
 */

router.patch("/:teaId", ensureTeaOwner, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, teaEditSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const tea = await Tea.update(req.params.teaId, req.body);
    return res.json({ tea });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * DELETES TEA
 *
 * Authorization: ensureTeaOwner
 */

router.delete("/:teaId", ensureTeaOwner, async function (req, res, next) {
  try {
    await Tea.remove(req.params.teaId);
    // removes TeaRelationship as well?
    return res.json({ deleted: req.params.teaId });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
