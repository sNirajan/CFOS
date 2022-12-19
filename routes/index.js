/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Cafe } = require("../models/cafeModel");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");
const { auth } = require("../middlewares/auth");

router.get("/", auth, function (req, res) {
    mongoose.connect(DB.uri);
    User.findOne({_id: mongoose.Types.ObjectId(req.session.userId)})
    .then(function(user) {
        if(user) {
            let query = {};
            if(user.accessLevel == 1 && user.workStation != "ALL_STATIONS") {
                query = { _id: mongoose.Types.ObjectId(user.workStation) };
            }
            Cafe.find(query).then(function(cafes) {
                if(cafes) {
                    res.render("../views/index.njk", {
                        username: user.firstName + " " + user.lastName,
                        userLevel: user.accessLevel,
                        cafes: cafes
                    });
                }
            });
        }
        else {
            res.redirect("/user/login");
        }
    });
});

module.exports = router;
