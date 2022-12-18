const mongoose = require("mongoose");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";
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
        required: true
    }
});

const Cafe = mongoose.model("cafes", cafeSchema);

async function seedCafe() {
    await mongoose.connect(uri);
    await mongoose.connection.db.dropCollection("cafes");

    let newCafe = new Cafe({
        name: "Pangea's Kitchen",
        location: "Riddel Hall",
        Phone: "123-456-789-0",
        description: "This is the main campus cafeteria.",
        isOpen: true
    });

    return result = await newCafe.save();
}

module.exports = {
    Cafe: Cafe,
    seedCafe: seedCafe
}
