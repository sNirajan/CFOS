const mongoose = require("mongoose");
const hash = require("pbkdf2-password")();
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";

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
            this.findOne({ email: email }, function (err, doc) {
                if(doc) {
                    hash({ password: password, salt: doc.salt }, function (err, pass, salt, hashed) {
                        if(err) throw err;
                        if(doc.hash === hashed) {
                            return cb(user);
                        }
                        else {
                            return cb(null);
                        }
                    });
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
    mongoose.connection.close();
    await mongoose.connect(uri);
    await mongoose.connection.db.dropCollection("users");

    let newUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "admin@test.com",
        hash: "sample",
        salt: "sample",
        position: "Manager",
        wage: "10000",
        workStation: "ALL_STATIONS",
        accessLevel: 0, 
        note: "This is a test admin user."
    });

    hash({password: "123"}, (err, password, salt, hashed) => {
        if(err) throw err;
        newUser.hash = hashed;
        newUser.salt = salt;
    });

    return result = await newUser.save();

}

module.exports = {
    User: User,
    seedUser: seedUser
}
