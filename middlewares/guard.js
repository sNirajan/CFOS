const express = require("express");
const session = require("express-session");
const path = require("path");
const { handleError } = require("../utils/errorHandlers");

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