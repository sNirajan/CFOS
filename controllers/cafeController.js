const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const { Cafe } = require("../models/cafeModel");
const { MenuItem } = require("../models/menuItemModel");
const { User } = require("../models/userModel");
const { Order } = require("../models/orderModel");
const { DB } = require("../config/config");

async function index(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            User.findOne({_id: req.session.userId}).then(function(user){
                if(user.accessLevel===0){
                    MenuItem.find({cafeId: cafe._id.toString()})
                    .then(function(menuItems) {
                        res.render("../views/cafe.njk", {
                            userLevel: 0,
                            cafe: cafe,
                            menuItems: menuItems
                        });
                    });
                }
                if(user.accessLevel===1){
                    Order.find({cafeId: req.params.cafeId}).then(function(orders){
                        res.render("../views/cafeEmployee.njk", {
                            cafe: cafe,
                            orders: orders
                        });
                    });
                }
                if(user.accessLevel===2){
                    MenuItem.find({cafeId: cafe._id.toString()})
                    .then(function(menu) {
                        res.render("../views/cafeCustomer.njk", {
                            cafe: cafe,
                            menu: menu
                        });
                    });
                }

            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function create(req, res) {
    res.render("../views/createCafe.njk", {
        _csrf: "TBI"
    });
}

async function insert(req, res) {
    let newCafe = new Cafe({
        name: req.body.name,
        location: req.body.location,
        Phone: req.body.phone,
        description: req.body.description,
        isOpen: (req.body.isOpen == "1")
    });

    await mongoose.connect(DB.uri);
    await newCafe.save(function(err) {
        if(err) throw err;
        else {
            res.redirect("/");
        }
    });
}

async function edit(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(Cafe) {
            res.render("../views/editCafe.njk", {
                _csrf: "TBI",
                cafe: cafe
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function update(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            for([key, value] of Object.entries(req.body)) {
                cafe[key] = value;
            }
            console.log(cafe);
            cafe.save(function(err) {
                if(err) throw err;
                else {
                    res.redirect("/cafe/" + req.params.cafeId);
                }
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function deleteCafe(req, res) {
    Cafe.deleteOne({_id: mongoose.Types.ObjectId(req.params.cafeId)}, function(err, deletedCafe) {
        if(err) throw err;
        else {
            res.send("OK");
        }
    });
}

module.exports = {
    index,
    create, 
    insert,
    edit,
    update,
    deleteCafe
}