const mongoose = require("mongoose");
const session = require("express-session");
const { Cafe } = require("../models/cafeModel");
const { MenuItem } = require("../models/menuItemModel");
const { User } = require("../models/userModel");
const { Order } = require("../models/orderModel");
const { DB } = require("../config/config");
const { handleError } = require("../middlewares/errorHandler"); 

async function index(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            User.findOne({_id: req.session.userId}).then(function(user){
                if(user.accessLevel === 0){
                    MenuItem.find({cafeId: cafe._id.toString()})
                    .then(function(menuItems) {
                        res.render("../views/cafeAdmin.njk", {
                            csrf: req.session.csrf,
                            cafe: cafe,
                            menuItems: menuItems
                        });
                    });
                }
                if(user.accessLevel === 1){
                    Order.find({cafeId: req.params.cafeId}).then(function(orders){
                        res.render("../views/cafeEmployee.njk", {
                            csrf: req.session.csrf,
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
            handleError(res, 404);
        }
    });
}

async function create(req, res) {
    res.render("../views/createCafe.njk", {
        csrf: req.session.csrf
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
        if(err) {
            handleError(res, 500);
        }
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
                csrf: req.session.csrf,
                cafe: cafe
            });
        }
        else {
            handleError(res, 404);;
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
            cafe.save(function(err) {
                if(err) {
                    handleError(res, 500);
                }
                else {
                    res.redirect("/cafe/" + req.params.cafeId);
                }
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

async function deleteCafe(req, res) {
    Cafe.deleteOne({_id: mongoose.Types.ObjectId(req.params.cafeId)}, function(err, deletedCafe) {
        if(err) {
            handleError(res, 500);
        }
        else {
            res.send("OK");
        }
    });
}

async function orderRetriever(req, res) {
    res.set({
        "Connection": "keep-alive",
        "Content-type": "text/event-stream"
      });
      await mongoose.connect(DB.uri);
      Order.watch().on("change", change => {
        if(change.operationType == "insert" && change.fullDocument.cafeId == req.params.cafeId) {
          res.write("event: " + req.params.cafeId + "\ndata: NEW_ORDER_FOUND\n\n");
        }
      });
}

async function startOrders(req, res) {
    await mongoose.connect(DB.uri);
    await Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        cafe.isOpen = req.body.startOrders;
        cafe.save(function(err) {
            if(err) {
                handleError(res, 500);
            }
            else {
                res.status(200).send("OK");
            }
        })
    })
}

module.exports = {
    index, create, insert, edit, update, deleteCafe, orderRetriever, startOrders
}