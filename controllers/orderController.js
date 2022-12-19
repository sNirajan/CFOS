const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const { Order } = require("../models/orderModel");
const { Cafe } = require("../models/cafeModel");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");

async function review(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            res.render("../views/orderCart.njk", {
                _csrf: "TBI",
                cafe: cafe
            });
        }
        else {
            console.log("Errorr");
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
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
            if(err) throw err;
            else {
                res.send({
                    id: order._id
                });
            }
        });
    });
}

async function approve(req, res) {
    await mongoose.connect(DB.uri);
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.orderId) })
    .then(function(order) {
        if(order) {
            order.status = req.body.status;
            order.save(function(err) {
                if(err) throw err;
                else {
                    res.send("Success");
                }
            });
        }
        else {
            console.log("Erorr");
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function decline(req, res) {
    await mongoose.connect(DB.uri);
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.orderId) })
    .then(function(order) {
        if(order) {
            order.status = req.body.status;
            order.save(function(err) {
                if(err) throw err;
                else {
                    res.send("Success");
                }
            });
        }
        else {
            console.log("Erorr");
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function ready(req, res) {
    await mongoose.connect(DB.uri);
    Order.findOne({ _id: mongoose.Types.ObjectId(req.params.orderId) })
    .then(function(order) {
        if(order) {
            order.status = req.body.status;
            order.save(function(err) {
                if(err) throw err;
                else {
                    res.send("Success");
                }
            });
        }
        else {
            console.log("Erorr");
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
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
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    }) 
}

module.exports = {
    review, checkout, approve, decline, ready, track
}