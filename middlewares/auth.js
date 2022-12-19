const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");

function authValidation(req, res, next) {
    if(req.session.userAuthToken && req.session.userId) {
        User.findOne({_id: mongoose.Types.ObjectId(req.session.userId)})
        .then(function(user) {
            if(user.temporaryAuthToken == req.session.userAuthToken) {
                next();
            }
            else {
                res.redirect("/user/login");
            }
        });
    }
    else {
        res.redirect("/user/login");
    }
}

function guestValidation(req, res, next) {
    if(req.session.userAuthToken && req.session.userId) {
        res.redirect("/");
    }
    else {
        next();
    }
}

module.exports = {
    auth: authValidation,
    guest: guestValidation
}



