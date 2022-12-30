/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Nirajan Shah
 */
const mongoose = require("mongoose");
const session = require("express-session");
const { Cafe } = require("../models/cafeModel");
const { MenuItem } = require("../models/menuItemModel");
const { DB } = require("../config/config");
const { handleError } = require("../middlewares/errorHandler")
const { menuItemErrorMsg, errorNameStr } = require("../utils/helper");

/**
 * Shows create menu item page
 */
async function create(req, res) {
    let errorMsg = menuItemErrorMsg(req.query.invalid);
    await mongoose.connect(DB.uri);
    Cafe.find({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe) {
            res.render("../views/createMenuItem.njk", {
                csrf: req.session.csrf,
                cafeId: req.params.cafeId,
                errorMessage: errorMsg
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Inserts a new menu_item document into DB
 */
async function insert(req, res) {
    let newItem = new MenuItem(req.body);
    await mongoose.connect(DB.uri);
    newItem.save(function(err) {
        if(err) {
            let invalidFields = errorNameStr(err);    
            if(invalidFields.length > 0) {
                res.redirect("/menuItem/create/" + req.body.cafeId + "/?invalid=" + invalidFields);
            }
            else {
                handleError(res, 500);
            }
        }
        else {
            res.redirect("/cafe/" + req.body.cafeId);
        }
    });
}

/**
 * Shows menu item edit page 
 */
async function edit(req, res) {
    let errorMsg = menuItemErrorMsg(req.query.invalid);
    await mongoose.connect(DB.uri);
    MenuItem.findOne({_id: mongoose.Types.ObjectId(req.params.itemId)})
    .then(function(menuItem) {
        if(menuItem) {
            res.render("../views/editMenuItem.njk", {
                csrf: req.session.csrf,
                menuItem: menuItem,
                errorMessage: errorMsg
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Updates a single menu_item document by id
 */
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
                if(err) {
                    let invalidFields = errorNameStr(err);    
                    if(invalidFields.length > 0) {
                        res.redirect("/menuItem/" + req.params.itemId + "/edit/?invalid=" + invalidFields);
                    }
                    else {
                        handleError(res, 500);
                    }
                }
                else {
                    res.redirect("/cafe/" + menuItem.cafeId);
                }
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Deletes a single document from menu_items collection by is 
 */
async function deleteMenuItem(req, res) {
    await mongoose.connect(DB.uri);
    MenuItem.deleteOne({_id: mongoose.Types.ObjectId(req.params.itemId)}, 
        function(err, deletedItem) {
            if(err) {
                handleError(res, 500);
            }
            else {
                res.send("OK");
            }
        });
}

module.exports = {
    create, insert, edit, update, deleteMenuItem
}