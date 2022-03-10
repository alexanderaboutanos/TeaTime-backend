/** @format */

/** Routes for saved_teas */

const express = require("express");
const router = express.Router();

const Saved = require("../models/saved");

const { ensureTeaOwner } = require("../middleware/auth");

/** POST /add
 *
 * Given a user_id, tea_id, and whether or not this will be added to WishList or to MyTea, add to the saved_teas DB.
 *
 * Returns {"saved new tea": tea_id, "addedTo": WishList OR MyTea}
 *
 * Authorization required: ensureTeaOwner
 * */

router.post("/add", ensureTeaOwner, async function (req, res, next) {
  try {
    const { userId, teaId, isMyTea, isWishList } = req.body;
    await Saved.addToSavedTeas(userId, teaId, isMyTea, isWishList);
    const addedTo = isMyTea ? "My Tea" : "Wish List";
    return res.json({ "saved new tea": teaId, addedTo: addedTo });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /switch
 *
 * Given a tea_id, move that tea from is_on_wish_list to is_my_tea.
 *
 * Returns { "Tea with id#:": req.params.id, addedTo: "My Tea" }
 *
 * Authorization required: ensureTeaOwner
 * */

router.patch("/switch/:teaId", ensureTeaOwner, async function (req, res, next) {
  try {
    await Saved.wishListToMyTea(req.params.teaId);
    return res.json({ "Tea with id#:": req.params.teaId, addedTo: "My Tea" });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * DELETES SAVED TEA
 *
 * must pass in the teaId, not the savedTea id.
 *
 * Authorization: ensureTeaOwner
 */

router.delete(
  "/delete/:teaId",
  ensureTeaOwner,
  async function (req, res, next) {
    try {
      await Saved.remove(req.params.teaId);
      return res.json({ deleted: req.params.teaId });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
