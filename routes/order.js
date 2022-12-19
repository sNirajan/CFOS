const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/:cafeId/review", auth, orderController.review);
router.post("/:cafeId/checkout", auth, csrf, orderController.checkout);
router.post("/:orderId/approve", auth, orderController.approve);
router.post("/:orderId/decline", auth, orderController.decline);
router.post("/:orderId/ready", auth, orderController.ready);
router.get("/:orderId/track", auth, orderController.track);

module.exports = router;
