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
