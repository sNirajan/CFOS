const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/:cafeId/review", orderController.review);
router.post("/:cafeId/checkout", orderController.checkout);

module.exports = router;
