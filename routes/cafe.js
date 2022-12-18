const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const cookieParser = require("cookie-parser");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";
const client = new mongodb.MongoClient(uri);

/**
 * GET route for showing a particular cafe
 * TODO: Restrict to authenticated users only.
 */
router.get("/cafe/:id", (req, res) => {
  getCafe(req.params["id"]).then((cafe) => {
    if (cafe == null) {
      res.status(404).sendFile("/public/404.html");
    } else {
      getCafeMenu(req.params["id"]).then((menu) => {
        getCafeOrders(req.params["id"]).then((orders)=>{
          let cafeTemplate = "./cafe.njk";
          console.log(req.cookies);
          if(req.cookies.user_level == 2) {
            cafeTemplate = "./cafeCustomer.njk";
          }
          else if(req.cookies.user_level == 1) {
            cafeTemplate = "./cafeEmployee.njk";
          }
          res.status(200).render(cafeTemplate, {
            userLevel: 0, //This value should be dynamically assigned when authentication is implemented (0 = admin, 1 = staff, 2 = customer)
            cafe: cafe,
            menu: menu,
            orders: orders,
          });
        });
      });
    }
  });
});

/**
 * GET route to show the form for creating new cafeteria.
 * POST route to store insert new cafeteria into DB.
 * TODO: Restrict to authenticated admin level users only.
 */

router.get("/createCafe", (req, res) => {
  csrf_token = generateCSRFToken(64);
  res.status(200).render("./createCafe.njk", {
    csrfToken: csrf_token,
  });
});

router.post("/createCafe", (req, res) => {
  async function insertCafe() {
    if (csrf_token == req.body.csrf_token) {
      await client.connect();
      const cafeListCol = client.db("uwcfos").collection("cafes");
      return cafeListCol.insertOne(req.body);
    } else {
      return null;
    }
  }
  insertCafe().then((result) => {
    if (result == null) {
      res.status(500).sendFile(__dirname + "/public/500.html");
    } else {
      res.redirect("/home");
    }
  });
});

/**
 * GET route to show the form for editing a cafeteria.
 * POST route to update the cafeteria info in DB.
 * TODO: Restrict to authenticated admin level users only.
 */

router.get("/cafe/:id/edit", (req, res) => {
  getCafe(req.params["id"]).then((cafe) => {
    if (cafe == null) {
      res.status(404).sendFile(__dirname + "/public/404.html");
    } else {
      res.status(200).render("./editCafe.njk", {
        cafe: cafe,
      });
    }
  });
});

router.post("/cafe/:id/edit", (req, res) => {
  async function updateCafe() {
    await client.connect();
    const cafeListCol = await client.db("uwcfos").collection("cafes");

    let query = { _id: mongodb.ObjectId(req.params["id"]) };
    let update = {
      $set: {
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        daysOpened: req.body.daysOpened,
        startTime: req.body.startTime,
        closeTime: req.body.closeTime,
        description: req.body.description,
      },
    };
    return cafeListCol.findOneAndUpdate(query, update, {});
  }
  updateCafe();
  res.redirect("/cafe/" + req.params["id"]);
});

/**
 * GET Route to delete a particular cafe by id.
 * TODO: Restrict to only authenticated admin level users.
 */
router.get("/cafe/:id/delete", (req, res) => {
  async function deleteCafe() {
    await client.connect();
    const cafeListCol = await client.db("uwcfos").collection("cafes");
    return cafeListCol.deleteOne({ _id: mongodb.ObjectId(req.params["id"]) });
  }
  deleteCafe();
  res.redirect("/");
});

/**
 * Function to retrieve a single cafeteria data by id.
 * @param { string } cafeId The id of the cafe to be retrieved.
 * @returns { Object } an object containing the cafe data.
 */
async function getCafe(cafeId) {
  await client.connect();
  const cafeListCol = await client.db("uwcfos").collection("cafes");
  const cursor = cafeListCol.findOne({ _id: mongodb.ObjectId(cafeId) });
  return await cursor;
}

/**
 * Function to retrieve the food menu of a particular cafeteria.
 * @param { string } cafeId Id of the cafe to retrieve its menu.
 * @returns { [Object] } The list of menu items for the given cafe.
 */
async function getCafeMenu(cafeId) {
  await client.connect();
  const menuItemCol = await client.db("uwcfos").collection("menu_items");
  const cursor = menuItemCol.find({ cafe_id: cafeId });
  return await cursor.toArray();
}

/**
 * Function to retrieve the orders of a particular cafeteria.
 * @param { string } cafeId Id of the cafe to retrieve its menu.
 * @returns { [Object] } The list of menu items for the given cafe.
 */
async function getCafeOrders(cafeId) {
  await client.connect();
  const orderCol = await client.db("uwcfos").collection("orders");
  const cursor = orderCol.find({ cafe_id: cafeId });
  return await cursor.toArray();
}

/**
 * Function to generate a random string for csrf token.
 * @param { int } length Length of the random string.
 * @returns a string of random characters.
 */
function generateCSRFToken(length) {
  let token = "";
  let charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return token;
}

module.exports = router;
