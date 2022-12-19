const express = require("express");
const session = require("express-session");

function csrfValidation(req, res, next) {
    console.log("req: " + req.session.csrf);
    console.log("body: " + req.body.csrf);
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