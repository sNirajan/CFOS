const express = require("express");
const session = require("express-session");
const { User } = require("../models/userModel");

function authValidation(req, res, next) {
    if(req.session.userAuthToken && req.session.userId) {
        next();
    }
    else {
        res.redirect("/user/login");
    }
}

module.exports = {
    auth: authValidation
}



