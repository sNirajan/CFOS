const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { csrf } = require("../middlewares/guard");

router.get("/login", authController.index);
router.post("/authenticate", csrf, authController.authenticate);
router.get("/signup", authController.create);
router.post("/signup", authController.insert);

module.exports = router;
