const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const crypto = require("crypto");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");
const { randomToken } = require("../utils/helper");

async function index(req, res) {
    res.render("../views/login.njk", {
        _csrf: "TBI"
    });
}

async function authenticate(req, res) {
    User.authenticate(req.body.email, req.body.password, function(user) {
        if(user) {
            user.temporaryAuthToken = crypto.randomBytes(16).toString("hex");
            user.save(function(err) {
                if(err) throw err;
                else {
                    req.session.regenerate(function () {
                        req.session.userAuthToken = user.temporaryAuthToken;
                        req.session.userId = user._id;
                        res.redirect("/");
                    });
                }
          });
        }
        else {
          res.redirect("/user/login");
        }
      });
}

async function create(req, res) {
    res.render("../views/signup.njk", {
        _csrf: "TBI"
    });
}

async function insert(req, res) {
    const salt = crypto.randomBytes(16).toString("hex"); 
    const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, "sha512").toString("hex"); 
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        position: "Customer",
        wage: 0.0,
        workStation: "NONE",
        accessLevel: 2,
        hash: hash,
        salt: salt,
        temporaryAuthToken: crypto.randomBytes(16).toString("hex")
    });

    await mongoose.connect(DB.uri);
    await newUser.save(function(err) {
        if(err) throw err;
        else {
            req.session.userAuthToken = newUser.temporaryAuthToken;
            req.session.userId = newUser._id;
            res.redirect("/")
        }
    });
}

module.exports = {
    index, 
    create,
    insert,
    authenticate
}