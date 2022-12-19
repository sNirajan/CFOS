/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const mongoose = require("mongoose");
const session = require("express-session");
const { Order } = require("../models/orderModel");
const { Cafe } = require("../models/cafeModel");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");
const { handleError } = require("../middlewares/errorHandler");

async function review(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            res.render("../views/orderCart.njk", {
                csrf: req.session.csrf,
                cafe: cafe
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

async function checkout(req, res) {
    await mongoose.connect(DB.uri);
    await User.findOne({_id: mongoose.Types.ObjectId(req.session.userId)})
    .then(function(user) {
        let newOrder = new Order({
            customerId: user._id,
            cafeId: req.params.cafeId,
            customerName: user.firstName + " " + user.lastName,
            status: "Pending",
            deliveryTime: Date.now(),
            orderItems: req.body.orderItems,
            subtotal: req.body.subtotal,
            tax: req.body.tax,
            total: req.body.total,
            instruction: req.body.instruction
        });
        newOrder.save(function(err, order) {
            if(err) {
                handleError(res, 500);
            }
            else {
                res.send({ id: order._id });
            }
        });
    });
}

async function update(req, res) {
    await mongoose.connect(DB.uri);
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.orderId) })
    .then(function(order) {
        if(order) {
            order.status = req.body.status;
            order.save(function(err) {
                if(err) {
                    handleError(res, 500);
                }
                else {
                    res.send("OK");
                }
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

async function track(req, res) {
    Order.findOne({_id: mongoose.Types.ObjectId(req.params.orderId)})
    .then(function(order) {
        if(order) {
            res.render("../views/orderTracker.njk", {
                order: order
            });
        }
        else {
            handleError(res, 404);
        }
    }) 
}

async function tracker(req, res) {
    res.set({
        "Connection": "keep-alive",
        "Content-type": "text/event-stream"
      });
      await mongoose.connect(DB.uri);
      Order.watch().on("change", change => {
        if(change.operationType == "update" && change.documentKey._id == req.params.orderId) {
          res.write("event: " + req.params.orderId + "\ndata: " + change.updateDescription.updatedFields.status + "\n\n");
        }
      });
}

module.exports = {
    review, checkout, update, track, tracker
}