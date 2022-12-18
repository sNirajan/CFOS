const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const { Cafe } = require("../models/cafeModel");
const { MenuItem } = require("../models/menuItemModel");
const { DB } = require("../config/config");

async function create(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.find({_id: mongoose.Types.ObjectId(req.query.cid)})
    .then(function(cafe) {
        if(cafe) {
            res.render("../views/createMenuItem.njk", {
                _csrf: "TBI",
                cafeId: req.query.cid
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function insert(req, res) {
    await mongoose.connect(DB.uri);

    let newItem = new MenuItem(req.body);
    console.log("here");
    newItem.save(function(err) {
        if(err) throw err;
        else {
            res.redirect("/cafe/" + req.body.cafeId);
        }
    });
}

async function edit(req, res) {
    await mongoose.connect(DB.uri);

    MenuItem.findOne({_id: mongoose.Types.ObjectId(req.params.itemId)})
    .then(function(menuItem) {
        if(menuItem) {
            res.render("../views/editMenuItem.njk", {
                _csrf: "TBI",
                menuItem: menuItem
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function update(req, res) {
    await mongoose.connect(DB.uri);

    MenuItem.findOne({_id: mongoose.Types.ObjectId(req.params.itemId)})
    .then(function(menuItem) {
        console.log(menuItem);
        if(menuItem) {
            for([key, value] of Object.entries(req.body)) {
                menuItem[key] = value;
            }
            menuItem.save(function(err) {
                if(err) throw err;
                else {
                    res.redirect("/cafe/" + menuItem.cafeId);
                }
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function deleteMenuItem(req, res) {
    await mongoose.connect(DB.uri);

    MenuItem.deleteOne({_id: mongoose.Types.ObjectId(req.params.itemId)}, 
        function(err, deletedItem) {
            if(err) throw err;
            else {
                res.send("OK");
            }
        });
}

module.exports = {
    create,
    insert,
    edit,
    update,
    deleteMenuItem
}