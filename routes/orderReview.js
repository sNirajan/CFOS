const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const cookieParser = require("cookie-parser");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";
const client = new mongodb.MongoClient(uri);


router.get("/:cafeId/review", (req, res) => {
    const cafeId = req.params["cafeId"];
    getCafe(cafeId).then(cafeInfo => {
        if(cafeInfo == null) {
            res.status(404).send('./public/404.html');
        }
        else {
            res.status(200).render('./orderReview.njk', {
                cafe: cafeInfo
            });
        }
    });
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

module.exports = router;
