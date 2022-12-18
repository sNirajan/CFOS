
const mongoose = require("mongoose");
const { nextTick } = require("process");
const uri = "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/uwcfos";

const orderSchema = new mongoose.Schema({
    // NOTE: No error should occur if the user sends request normally through the html form.
    userId: {
        type: String,
        required: true
    },
    cafeId: {
        type: String,
        required: true
    },
    orderTime: {
        type: Date,
        required: true,
        default: Date.now()
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: false
    },
    total: {
        type: Number,
        required: true
    },
    orderItems: {
        type: Array,
        required: true
    },
    instruction: {
        type: String,
        required: false
    },
    deliveryTime: {
        type: Date,
        required: false
    }
});

const Order = mongoose.model("orders", orderSchema);

async function seedOrder() {
    await mongoose.connect(uri);
    await mongoose.connection.db.dropCollection("orders");

    let newOrder = new Order({
        userId: "6360078867776f417965a0a8",
        cafeId: "635add5398b892de63c25794",
        subtotal: 100.00,
        tax: 13.00,
        total: 113.00,
        orderItems: [
            { itemId: "635dbd9da603da98106fc350" },
            { itemId: "635dbd9da603da98106fc350" },
            { itemId: "635dbd9da603da98106fc350" }
        ],
        instruction: "No pickle!"
    });

    return result = await newOrder.save();
}

module.exports = {
    Order: Order,
    seedOrder: seedOrder
}
