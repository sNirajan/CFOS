const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const cookieParser = require("cookie-parser");
const {User} = require("../models/userModel");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";
const client = new mongodb.MongoClient(uri);

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

/**
 * GET route for the login page.
 * POST route to authenticate the user.
 * TODO: restrict to authenticated users only.
 */

router.get("/login", (req, res) => {
  res.status(200).render("./loginPage.njk", {});
});

router.post('/authenticate', (req, res) => {
  req.model.authenticate(req.body.email, req.body.password, function(user) {
    if(user) {
      req.session.regenerate(function () {
        req.session.user = user.email;
        getCafes().then((cafes) => {
          res.status(200).render("./index.njk", {
            username: user.firstName + " " + user.lastName,
            userLevel: user.accessLevel, // (0 = admin, 1 = staff, 2 = customer)
            cafeList: cafes,
          });
        });
        res.redirect('/');
      });
    }
    else {
      res.redirect('/login');
    }
  });
});

/**
 * Function to retrieve the entire collection of cafeterias from DB.
 * @returns { [Object] } the list of cafeterias.
 */
async function getCafeList() {
  await client.connect();
  const cafeListCol = await client.db("uwcfos").collection("cafes");
  const cursor = cafeListCol.find({});
  return await cursor.toArray();
}

//example restrict use
router.route("/restricted")
.get(restrict, (req, res) => {
  res.send("restricted content for " + req.session.user);
})

module.exports = router;
