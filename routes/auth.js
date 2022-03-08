/** @format */

const express = require("express");
const router = express.Router();
const userLogin = require("../schemas/userLogin.json");
const userRegister = require("../schemas/userRegister.json");

router.get("/", async function (req, res, next) {
  res.send("hello world");
});

module.exports = router;
