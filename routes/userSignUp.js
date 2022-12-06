const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);
/**
 * GET route for the signUp page.
 * POST route to add the user to the DB.
 * TODO: insert new user as customer in MongoDB
 */

router.get("/signup", (req, res) => {
  res.status(200).render("./signUp.njk", {});
});

router.post("/signup", (req, res) => {
  async function insertUser() {
    await client.connect();
    const userCol = await client.db("cafe's").collection("users");
    console.log(req.body);
    req.body.user_level = 2;
    delete req.body.ConfirmPassword;
    return userCol.insertOne(req.body);
  }
  insertUser().then((result) => {
    if (result == null) {
      res.status(500).sendFile(__dirname + "/public/500.html");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
