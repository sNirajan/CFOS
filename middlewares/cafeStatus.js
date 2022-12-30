/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Nirajan Shah
 */
const express = require("express");
const mongoose = require("mongoose");
const { Cafe } = require("../models/cafeModel");
const { DB } = require("../config/config");

/**
 * Checks if a cafe is open or closed for order
 */
function checkCafeStatus(req, res, next) {
    mongoose.connect(DB.uri);
    Cafe.findOne({_id: mongoose.Types.ObjectId(req.params.cafeId)})
    .then(function(cafe) {
        if(cafe && cafe.isOpen) {
            next();
        }
        else {
            res.redirect("/cafe/" + req.params.cafeId);
        }
    });
}

module.exports = {
    openCafe: checkCafeStatus
}