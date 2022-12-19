const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const { Order } = require("../models/orderModel");
const { Cafe } = require("../models/cafeModel");
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

async function checkout(req, res) {
    let data = req.body;
    data.userId = req.session.userId;
    data.cafeId = req.params.cafeId;
    data.orderTime = Date.now();
    data.status = "Pending",
    deliveryTIme = Date.now(); 
    let newOrder = new Order(data);

    await mongoose.connect(DB.uri);
    await newOrder.save(function(err) {
        if(err) throw err;
        else {
            res.redirect("/");
        }
    });
}

module.exports = {
    review,
    checkout,
    approve,
    decline,
    ready
}