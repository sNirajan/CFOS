const express = require("express");
const router = express.Router();
const multiparty = require("multiparty");
const fs = require("fs");

/**
 * GET route to show the Instafood page.
 */
router.get("/instafood", (req, res) => {
  let foodImgList = [];
  fs.readdirSync("./public/instafood/").forEach((file) => {
    foodImgList.push(file);
  });
  res.status(200).render("instafood.njk", {
    foodImgList: foodImgList,
  });
});

/**
 * POST route to save uploaded image to the local disk.
 * TODO: Resctrict to authenticated users only.
 */
router.post("/instafood/uploadImage", (req, res) => {
  let form = new multiparty.Form({ uploadDir: "./public/instafood" });
  form.parse(req, (err, fields, files) => {
    res.redirect("/instafood");
  });
});

module.exports = router;
