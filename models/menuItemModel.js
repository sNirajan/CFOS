
const mongoose = require("mongoose");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";

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
    await mongoose.connect(uri);
    await mongoose.connection.db.dropCollection("menu_items");

    let newMenuItem = new MenuItem({
        cafeId: mongoose.Types.ObjectId("635add5398b892de63c25794"),
        name: "Pasta",
        price: 10.2,
        description: "This is regular pasta!",
        isAvailable: true
    });

    return result = await newMenuItem.save();

}

module.exports = {
    MenuItem: MenuItem,
    seedMenuItem: seedMenuItem
}
