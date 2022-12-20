/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const { handleError } = require("../middlewares/errorHandler");

/**
 * Checks if the reuquest comes from an authenticated user
 */
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

/**
 * Checks if the request comes from an unauthenticated user. 
 * This middleware is used to ensure that authenticated users cannot... 
 * access guest pages such as login page without first logging out
 */
function guestValidation(req, res, next) {
    if(req.session.userAuthToken && req.session.userId) {
        res.redirect("/");
    }
    else {
        next();
    }
}

/**
 * Checks if an authenticated user has admin level access
 */
function adminValidation(req, res, next) {
    if(req.session.userAuthToken 
        && req.session.userId 
        && req.session.userLevel != undefined //NOTE: don't remove 'undefined', since userLevel=0 will cause the condition to fail
        && req.session.userLevel == 0) {
            next();
    }
    else {
        handleError(res, 404);
    }
        
}

/**
 * Checks if the user has employee level access. 
 */
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

/**
 * Checks if the user is a customer
 */
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



