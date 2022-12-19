const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/:cafeId/review", orderController.review);
router.post("/:cafeId/checkout", orderController.checkout);
router.post("/:orderId/approve", orderController.approve);
router.post("/:orderId/decline", orderController.decline);
router.post("/:orderId/ready", orderController.ready);

module.exports = router;
