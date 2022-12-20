/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */
const mongoose = require("mongoose");
const session = require("express-session");
const crypto = require("crypto");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");
const { handleError } = require("../middlewares/errorHandler")

/**
 * Shows login page
 */
async function index(req, res) {
    req.session.csrf = crypto.randomBytes(64).toString('base64');
    res.render("../views/login.njk", {
        csrf: req.session.csrf,
        validationFailed: req.query.q !== undefined
    });
}

/**
 * Verifies user credentials
 */
async function authenticate(req, res) {
    User.authenticate(req.body.email, req.body.password, function(user) {
        if(user) {
            user.temporaryAuthToken = crypto.randomBytes(64).toString("hex");
            user.save(function(err) {
                if(err) handleError(res, 500);
                else {
                    req.session.regenerate(function () {
                        req.session.csrf = crypto.randomBytes(64).toString('base64');
                        req.session.userAuthToken = user.temporaryAuthToken;
                        req.session.userId = user._id;
                        req.session.userLevel = user.accessLevel;
                        res.redirect("/");
                    });
                }
          });
        }
        else {
          res.redirect("/user/login/?q=invalid");
        }
      });
}

/**
 * Shows signup page
 */
async function create(req, res) {
    res.render("../views/signup.njk", {
        csrf: req.session.csrf
    });
}

/**
 * Inserts new user into DB
 */
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
        temporaryAuthToken: crypto.randomBytes(64).toString('base64')
    });
    await mongoose.connect(DB.uri);
    await newUser.save(function(err) {
        if(err) {
            for(error in err.errors) {
                if(error == "email") {
                    res.status(400).send({message: "Email is not valid." });
                    break;
                }
                else {
                    handleError(res, 500);
                    break;
                }
            } 
        }  
        else {
            req.session.regenerate(function () {
                req.session.csrf = crypto.randomBytes(64).toString('base64');
                req.session.userAuthToken = newUser.temporaryAuthToken;
                req.session.userId = newUser._id;
                req.session.userLevel = newUser.accessLevel;
                res.redirect("/");
            });
        }
    });
}

/**
 * Logs out user
 */
async function logout(req, res) {
    req.session.destroy();
    res.redirect("/user/login");
}

module.exports = {
    index, create, insert, authenticate, logout
}