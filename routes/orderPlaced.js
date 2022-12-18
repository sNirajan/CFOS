const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);

const ordersSchema = new mongoose.Schema({
    //menuItems: [String],
    instruction: String,
    subtotal: String,
    tax: String,
    total: String,
    orderTime: String,
    status: String,
    orderDeliveredTime: String
})

const orders = new mongoose.model('orders', ordersSchema);


router.post("/:cafeId/review/orderPlaced", (req, res) => {
    const cafeId = req.params["cafeId"];
    let today = new Date();
    let date = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
    let time = today.getHours()+":"+today.getMinutes()+":"+today.getSeconds();
    let currentTime  = date + " " + time;

    getCafe(cafeId).then(cafeInfo => {
        if(cafeInfo == null) {
            res.status(404).send('./public/404.html');
        }
        else {
            let newOrder = {
                user_id: "string",
                cafe_id: cafeId,
                instruction: "Fresh",
                subtotal: req.body.subtotal,
                tax: req.body.tax,
                total: req.body.total,
                orderTime: currentTime,
                status: "Pending",
                orderDeliveredTime: "Pending",
                menuItems: req.body.itemsList
            };
            async function insertEmployee() {
                await client.connect();
                const employeeCol = await client.db("cafe's").collection("orders");
                return employeeCol.insertOne(newOrder);
            }
            insertEmployee();
            res.send("your order is Placed");
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
    const cafeListCol = await client.db("cafe's").collection("cafe_lists");
    const cursor = cafeListCol.findOne({ _id: mongodb.ObjectId(cafeId) });
    return await cursor;
  }
  
module.exports = router;