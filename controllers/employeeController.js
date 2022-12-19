const mongoose = require("mongoose");
const session = require("express-session");
const crypto = require("crypto");
const { Cafe } = require("../models/cafeModel");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");
const { handleError } = require("../middlewares/errorHandler");
const { employeeErrorMsg, errorNameStr } = require("../utils/helper");

/**
 * Shows the employee list page 
 */
async function index(req, res) {
    await mongoose.connect(DB.uri);
    User.find({$or: [{accessLevel: 0}, {accessLevel: 1}]}).then(function(employees) {
        if(employees) {
            res.render("../views/employee.njk", {
                employees: employees,
                csrf: req.session.csrf
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Shows the create employee page
 */
async function create(req, res) {
    let errorMsg = employeeErrorMsg(req.query.invalid);
    await mongoose.connect(DB.uri);
    Cafe.find({}).then(function(cafes) {
        if(cafes) {
            res.render("../views/createEmployee.njk", {
                csrf: req.session.csrf,
                cafes: cafes,
                errorMessage: errorMsg
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Inserts a single document into the user collection
 */
async function insert(req, res) {
    if(req.body.password != req.body.confirmPassword) {
        res.redirect("/employee/create/?invalid=password");
    }
    else {
        req.body.salt = crypto.randomBytes(16).toString("hex"); 
        req.body.hash = crypto.pbkdf2Sync(req.body.password ,req.body.salt, 1000, 64, "sha512").toString("hex"); 
        let newUser = new User(req.body);

        await mongoose.connect(DB.uri);  
        newUser.save(function(err) {
            if(err) {
                let invalidFields = errorNameStr(err);    
                if(invalidFields.length > 0) {
                    res.redirect("/employee/create/?invalid=" + invalidFields);
                }
                else {
                    handleError(res, 500);
                }
            }
            else {
                res.redirect("/employee");
            }
        });
    }
}

/**
 * Shows the employee edit page
 */
async function edit(req, res) {
    let errorMsg = employeeErrorMsg(req.query.invalid);
    await mongoose.connect(DB.uri);
    User.findOne({_id: mongoose.Types.ObjectId(req.params.employeeId)})
    .then(function(employee) {
        if(employee) {
            Cafe.find({}).then(function(cafes) {
                if(cafes) {
                    res.render("../views/editEmployee.njk", {
                        csrf: req.session.csrf,
                        employee: employee,
                        cafes: cafes,
                        errorMessage: errorMsg
                    });
                }
                else {
                    handleError(res, 500);
                }
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Updates a single user document by id (user is employee)
 */
async function update(req, res) {
    await mongoose.connect(DB.uri);
    User.findOne({_id: mongoose.Types.ObjectId(req.params.employeeId)})
    .then(function(employee) {
        if(employee) {
            for([key, value] of Object.entries(req.body)) {
                employee[key] = value;
            }
            employee.save(function(err) {
                if(err) {
                    let invalidFields = errorNameStr(err);    
                    if(invalidFields.length > 0) {
                        res.redirect("/employee/" + req.params.employeeId + "/edit/?invalid=" + invalidFields);
                    }
                    else {
                        handleError(res, 500);
                    }
                }
                else {
                    res.redirect("/employee");
                }
            });
        }
        else {
            handleError(res, 404);
        }
    });
}

/**
 * Permanently removes a single user (employee) document from user collection
 */
async function deleteEmployee(req, res) {
    await mongoose.connect(DB.uri);
    User.deleteOne({_id: mongoose.Types.ObjectId(req.params.employeeId)}, function(err, deletedEmployee) {
        if(err) {
            handleError(res, 500);
        }
        else {
            res.send("OK");
        }
    });
}

module.exports = {
    index, create, insert, edit, update, deleteEmployee
}