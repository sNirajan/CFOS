const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { User } = require("../models/userModel");
const authController = require("../controllers/authController");

router.get("/login", authController.index);
router.post("/authenticate", authController.authenticate);
router.get("/signup", authController.create);
router.post("/signup", authController.insert);

module.exports = router;
