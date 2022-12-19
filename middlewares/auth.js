const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");

function authValidation(req, res, next) {
    console.log(req.session);
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

module.exports = {
    auth: authValidation
}



