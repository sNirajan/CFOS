const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { handleError } = require("../middlewares/errorHandler");

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

function adminValidation(req, res, next) {
    if(req.session.userAuthToken 
        && req.session.userId 
        && req.session.userLevel
        && req.session.userLevel == 0) {
            next();
    }
    else {
        handleError(res, 500);
    }
        
}

function employeeValidation(req, res, next) {
    if(req.session.userAuthToken 
        && req.session.userId 
        && req.session.userLevel
        && req.session.userLevel == 1) {
            next();
    }
    else {
        handleError(res, 500);
    }
        
}

function customerValidation(req, res, next) {
    if(req.session.userAuthToken 
        && req.session.userId 
        && req.session.userLevel
        && req.session.userLevel == 2) {
            next();
    }
    else {
        handleError(res, 500);
    }
        
}

module.exports = {
    auth: authValidation,
    guest: guestValidation,
    admin: adminValidation,
    customer: customerValidation,
    employee: employeeValidation
}



