/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { csrf } = require("../middlewares/guard");
const { auth, guest } = require("../middlewares/auth");

router.get("/login", guest, authController.index);
router.post("/authenticate", guest, csrf, authController.authenticate);
router.get("/signup", guest, authController.create);
router.post("/signup", guest, authController.insert);
router.get("/logout", auth, authController.logout);

module.exports = router;
