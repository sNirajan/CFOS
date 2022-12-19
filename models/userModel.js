/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const mongoose = require("mongoose");
const crypto = require("crypto");
const { DB } = require("../config/config");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /.+\@.+\..+/,
        unique: true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    wage: {
        type: Number,
        required: true
    }, 
    workStation: {
        type: String,
        required: true
    },
    accessLevel: {
        type: Number,
        required: true,
        validator: {
            validate: Number.isInteger,
            message: "Something went wrong. Please try again!"
        }
    },
    note: {
        type: String,
        required: false
    },
    temporaryAuthToken: {
        type: String,
        required: false
    }
}, { 
    statics: {
        authenticate(email, password, cb) {
            mongoose.connect(DB.uri);
            this.findOne({ email: email }, function (err, user) {
                if(user) {
                    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, "sha512").toString("hex"); 
                    if(hash == user.hash) {
                        return cb(user);
                    }
                    else {
                        return cb(null);
                    }
                }
                else {
                    return cb(null);
                }
            });
        }
    }
});

const User = mongoose.model("user", userSchema);

async function seedUser() {
    const salt = crypto.randomBytes(16).toString("hex"); 
    const hash = crypto.pbkdf2Sync("test", salt, 1000, 64, "sha512").toString("hex"); 
    let newUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "admin@test.com",
        hash: hash,
        salt: salt,
        position: "Manager",
        wage: "10000",
        workStation: "ALL_STATIONS",
        accessLevel: 0, 
        note: "This is a test admin user."
    });

    await mongoose.connect(DB.uri);
    await mongoose.connection.db.dropCollection("users");
    return result = await newUser.save();
}

module.exports = {
    User: User,
    seedUser: seedUser
}
