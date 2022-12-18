const mongoose = require("mongoose");
const session = require("express-session");
const crypto = require("crypto");
const path = require("path");
const { Cafe } = require("../models/cafeModel");
const { User } = require("../models/userModel");
const { DB } = require("../config/config");

async function index(req, res) {
    await mongoose.connect(DB.uri);
    User.find({$or: [{accessLevel: 0}, {accessLevel: 1}]}).then(function(employees) {
        if(employees) {
            res.render("../views/employee.njk", {
                employees: employees
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function create(req, res) {
    await mongoose.connect(DB.uri);
    Cafe.find({}).then(function(cafes) {
        if(cafes) {
            res.render("../views/createEmployee.njk", {
                _csrf: "TBI",
                cafes: cafes
            });
        }
        else {
            res.status(500).sendFile(path.join(__dirname, '../public', '500.html'));
        }
    });
}

async function insert(req, res) {
    req.body.salt = crypto.randomBytes(16).toString(); 
    req.body.hash = crypto.pbkdf2Sync("test", req.body.salt, 1000, 64, "sha512").toString(); 
    let newUser = new User(req.body);

    await mongoose.connect(DB.uri);  
    newUser.save(function(err) {
        if(err) throw err;
        else {
            res.redirect("/employee");
        }
    });
}

async function edit(req, res) {
    await mongoose.connect(DB.uri);
    User.findOne({_id: mongoose.Types.ObjectId(req.params.employeeId)})
    .then(function(employee) {
        if(employee) {
            Cafe.find({}).then(function(cafes) {
                if(cafes) {
                    res.render("../views/editEmployee.njk", {
                        _csrf: "TBI",
                        employee: employee,
                        cafes: cafes
                    });
                }
                else {
                    res.status(500).sendFile(path.join(__dirname, '../public', '500.html'));
                }
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function update(req, res) {
    await mongoose.connect(DB.uri);
    User.findOne({_id: mongoose.Types.ObjectId(req.params.employeeId)})
    .then(function(employee) {
        if(employee) {
            for([key, value] of Object.entries(req.body)) {
                employee[key] = value;
            }
            employee.save(function(err) {
                if(err) throw err;
                else {
                    res.redirect("/employee");
                }
            });
        }
        else {
            res.status(404).sendFile(path.join(__dirname, '../public', '404.html'));
        }
    });
}

async function deleteEmployee(req, res) {
    await mongoose.connect(DB.uri);
    User.deleteOne({_id: mongoose.Types.ObjectId(req.params.employeeId)}, function(err, deletedEmployee) {
        if(err) throw err;
        else {
            res.send("OK");
        }
    });
}

module.exports = {
    index,
    create,
    insert,
    edit,
    update,
    deleteEmployee
}