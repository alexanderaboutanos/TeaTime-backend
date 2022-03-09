/** @format */

/** Routes for saved_teas */

const express = require("express");
const router = express.Router();

const Saved = require("../models/saved");

// const ensureLoggedIn = require("../middleware/auth");

/** PLAN
 *
 * deleteSavedTea(tea_id)
 *
 * editWishListToPersonal(tea_id)
 *
 *
 */

/** POST /add
 *
 * Given a user_id, tea_id, and whether or not this will be added to WishList or to MyTea, add to the saved_teas DB.
 *
 * Returns {"saved new tea": tea_id, "addedTo": WishList OR MyTea}
 *
 * Authorization required: same-user-as-:username
 * */

router.post("/add", async function (req, res, next) {
  try {
    const { userId, teaId, isMyTea, isWishList } = req.body;
    await Saved.addToSavedTeas(userId, teaId, isMyTea, isWishList);
    const addedTo = isMyTea ? "My Tea" : "Wish List";
    return res.json({ "saved new tea": teaId, addedTo: addedTo });
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
 * Authorization: EnsureOwnerOfTea(wishList or myTea)
 */

router.delete("/delete/:id", async function (req, res, next) {
  console.log(req.params.id);
  try {
    await Saved.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
