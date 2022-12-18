const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const { User } = require("../models/userModel");
const authController = require("../controllers/authController");

router.use((req, res, next) => {
  req.model = User;
  next();
});

function restrict(req, res, next) {
  if(req.session.user) {
    next();
  }
  else {
    req.session.error = "Access Denied";
    //redirect to login page.
  }
}

router.get("/login", authController.index);
router.post("/authenticate", authController.authenticate);
router.get("/signup", authController.create);
router.post("/signup", authController.insert);

//example restrict use
router.route("/restricted")
.get(restrict, (req, res) => {
  res.send("restricted content for " + req.session.user);
})

module.exports = router;
