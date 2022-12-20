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

//NOTE: All urls have prefix "/instafood" attched from server.js. For example, "/" is actually "/instafood".

/**
 * Shows the instafood page which is a statically served page
 */
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

/**
 * saves an image file in the specified directory. 
 * NOTE FOR FUTURE DEV: UPLOADED FILES NEED TO BE VERIFIED FOR SECURITY. 
 */
router.post("/uploadImage", auth, (req, res) => {
  let form = new multiparty.Form({ uploadDir: "./public/instafood" });
  form.parse(req, (err, fields, files) => {
    res.redirect("/instafood");
  });
});

module.exports = router;
