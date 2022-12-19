/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const session = require("express-session");

function csrfValidation(req, res, next) {
    if(req.session.csrf == req.body.csrf) {
        next();
    } 
    else {
        res.redirect("/user/login");
    }
}

module.exports = {
    csrf: csrfValidation
}