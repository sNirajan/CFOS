const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/order/:cafeId/review", orderController.review);
router.post("/order/:cafeId/checkout", orderController.checkout);

module.exports = router;
