/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const router = express.Router();
const multiparty = require("multiparty");
const fs = require("fs");
const { auth } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/", auth, (req, res) => {
  let foodImgList = [];
  fs.readdirSync("./public/instafood/").forEach((file) => {
    foodImgList.push(file);
  });
  res.status(200).render("instafood.njk", {
    foodImgList: foodImgList,
    csrf: req.session.csrf
  });
});

router.post("/uploadImage", auth, (req, res) => {
  let form = new multiparty.Form({ uploadDir: "./public/instafood" });
  form.parse(req, (err, fields, files) => {
    res.redirect("/instafood");
  });
});

module.exports = router;
