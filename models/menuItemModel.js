const mongoose = require("mongoose");
const { DB } = require("../config/config");

const menuItemSchema = new mongoose.Schema({
    cafeId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    isAvailable: {
        type: Boolean,
        required: true
    }
});

const MenuItem = mongoose.model("menu_items", menuItemSchema);

async function seedMenuItem() {
    let newMenuItem = new MenuItem({
        cafeId: mongoose.Types.ObjectId("635add5398b892de63c25794"),
        name: "Pasta",
        price: 10.2,
        description: "This is regular pasta!",
        isAvailable: true
    });

    await mongoose.connect(DB.uri);
    await mongoose.connection.db.dropCollection("menu_items");
    return result = await newMenuItem.save();
}

module.exports = {
    MenuItem: MenuItem,
    seedMenuItem: seedMenuItem
}
