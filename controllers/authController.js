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
        console.log(user);
        if(user) {
            user.temporaryAuthToken = randomToken(64);
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
          res.redirect("/login");
        }
      });
}

async function create(req, res) {
    res.render("../views/signup.njk", {
        _csrf: "TBI"
    });
}

async function insert(req, res) {
    const salt = crypto.randomBytes(16).toString(); 
    const hash = crypto.pbkdf2Sync("test", salt, 1000, 64, "sha512").toString(); 
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        position: "Customer",
        wage: 0.0,
        workStation: "NONE",
        accessLevel: 2,
        hash: hash,
        salt: salt
    })

    await mongoose.connect(DB.uri);
    await newUser.save(function(err) {
        if(err) throw err;
        else {
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