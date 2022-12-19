/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const mongoose = require("mongoose");
const { DB } = require("../config/config");

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    isOpen: {
        type: Boolean,
        default: false,
        required: true
    }
});

const Cafe = mongoose.model("cafes", cafeSchema);

async function seedCafe() {
    let newCafe = new Cafe({
        name: "Pangea's Kitchen",
        location: "Riddel Hall",
        phone: "1234567890",
        description: "This is the main campus cafeteria.",
        isOpen: true
    });
    await mongoose.connect(DB.uri);
    await mongoose.connection.db.dropCollection("cafes");
    return result = await newCafe.save();
}

module.exports = {
    Cafe: Cafe,
    seedCafe: seedCafe
}
