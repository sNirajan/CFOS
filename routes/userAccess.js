const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);

/**
 * GET route for the login page.
 * POST route to authenticate the user.
 * TODO: restrict to authenticated users only.
 */

router.get("/", (req, res) => {
  res.status(200).render("./loginPage.njk", {});
});

router.post("/", (req, res) => {
  email = req.body.email;
  password = req.body.password;
  findUserCredentials(email, password).then((userList) => {
    if (userList == null) {
      res.redirect("/");
    } else {
      getCafeList().then((cafeList) => {
        res.status(200).render("./index.njk", {
          username: userList.firstName + " " + userList.lastName,
          userLevel: userList.user_level, // (0 = admin, 1 = staff, 2 = customer)
          cafeList: cafeList,
        });
      });
    }
  });
});

/**
 * GET route for the signUp page.
 * POST route to add the user to the DB.
 * TODO: insert new user as customer in MongoDB
 */

router.get("/signup", (req, res) => {
  res.status(200).render("./signUp.njk", {});
});

router.post("/", (req, res) => {
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

/**
 * Function to retrieve the entire collection of users from DB.
 * @returns { [Object] } the list of users.
 */
async function findUserCredentials(email, password) {
  await client.connect();
  const userCol = await client.db("cafe's").collection("users");
  const cursor = userCol.findOne({ email, password });
  return await cursor;
}

/**
 * Function to retrieve the entire collection of cafeterias from DB.
 * @returns { [Object] } the list of cafeterias.
 */
async function getCafeList() {
  await client.connect();
  const cafeListCol = await client.db("cafe's").collection("cafe_lists");
  const cursor = cafeListCol.find({});
  return await cursor.toArray();
}

module.exports = router;
