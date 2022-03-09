/** @format */

/** Routes for saved_teas */

const express = require("express");
const router = express.Router();

const Saved = require("../models/saved");

// const ensureLoggedIn = require("../middleware/auth");

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

/** PATCH /switch
 *
 * Given a tea_id, move that tea from is_my_tea to is_on_wish_list
 *
 * Returns { "Tea with id#:": req.params.id, addedTo: "My Tea" }
 *
 * Authorization required: same-user-as-:username
 * */

router.patch("/switch/:id", async function (req, res, next) {
  try {
    await Saved.wishListToMyTea(req.params.id);
    return res.json({ "Tea with id#:": req.params.id, addedTo: "My Tea" });
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
  try {
    await Saved.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
