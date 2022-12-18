const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";
const client = new mongodb.MongoClient(uri);

/**
 * GET route for showing the form to create new menu item for a particular cafe.
 * POST route for storing the new menu item into DB.
 * TODO: Restrict to authenticated admin level users only.
 */

router.get("/cafe/:id/createMenuItem", (req, res) => {
  getCafe(req.params["id"]).then((cafe) => {
    if (cafe == null) {
      res.status(404).sendFile(__dirname + "/public/404.html");
    } else {
      res.status(200).render("createMenuItem.njk", {
        cafe: cafe,
      });
    }
  });
});

router.post("/cafe/:id/createMenuItem", (req, res) => {
  async function insertMenuItem() {
    await client.connect();
    const menuItemCol = await client.db("uwcfos").collection("menu_items");
    req.body.cafe_id = req.params["id"];
    return menuItemCol.insertOne(req.body);
  }
  insertMenuItem();
  res.redirect(`/cafe/${req.params["id"]}`);
});

/**
 * GET route to show the form for editing a menu item.
 * POST route to update the menu item in DB.
 * TODO: Restrict to authenticated admin level users only.
 */

router.get("/menu/:id/edit", (req, res) => {
  getMenuItem(req.params["id"]).then((menuItem) => {
    if (menuItem == null) {
      res.status(404).sendFile(__dirname + "/public/404.html");
    } else {
      res.status(200).render("./editMenuItem.njk", {
        menuItem: menuItem,
      });
    }
  });
});

router.post("/menu/:id/edit", (req, res) => {
  async function updateMenuItem() {
    await client.connect();
    const menuItemCol = await client.db("uwcfos").collection("menu_items");

    let query = { _id: mongodb.ObjectId(req.params["id"]) };
    let update = {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        isAvailable: req.body.isAvailable,
      },
    };
    return menuItemCol.findOneAndUpdate(query, update, {});
  }
  updateMenuItem();

  getMenuItem(req.params["id"]).then((menuItem) => {
    if (menuItem == null) {
      res.status(404).sendFile(__dirname + "/public/404.html");
    } else {
      res.redirect("/cafe/" + menuItem.cafe_id);
    }
  });
});

/**
 * GET Route to delete a particular menu item by id.
 * TODO: Restrict to only authenticated admin level users.
 */

router.get("/menu/:id/delete", (req, res) => {
  async function deleteMenuItem() {
    await client.connect();
    const menuItemCol = await client.db("uwcfos").collection("menu_items");
    return menuItemCol.deleteOne({ _id: mongodb.ObjectId(req.params["id"]) });
  }
  deleteMenuItem();
  res.send("SUCCESS");
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
 * Function to retrieve a single item from a cafe menu.
 * @param { string } menuId Id of the menu item to retrieve.
 * @returns { Object } The menu item object.
 */
async function getMenuItem(menuId) {
  await client.connect();
  const menuItemCol = await client.db("uwcfos").collection("menu_items");
  const cursor = menuItemCol.findOne({ _id: mongodb.ObjectId(menuId) });
  return await cursor;
}

module.exports = router;
