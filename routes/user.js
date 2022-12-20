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

/**
 * Routes for user authentication related pages.
 * All urls have prefix "/user" attched from server.js. For example, "/login" is actually "/user/login".
 * NOTE: Please DO NOT chnage the order of the routes without caution as it may produce errors.
 */
router.get("/login", guest, authController.index);
router.post("/authenticate", guest, csrf, authController.authenticate);
router.get("/signup", guest, authController.create);
router.post("/signup", guest, authController.insert);
router.get("/logout", auth, authController.logout);

module.exports = router;
