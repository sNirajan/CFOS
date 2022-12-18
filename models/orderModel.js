const mongoose = require("mongoose");
const { DB } = require("../config/config");

const orderSchema = new mongoose.Schema({
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
        instruction: "No pickle!",
        deliveryTime: Date.now()
    });

    await mongoose.connect(Db.uri);
    await mongoose.connection.db.dropCollection("orders");
    return result = await newOrder.save();
}

module.exports = {
    Order: Order,
    seedOrder: seedOrder
}
