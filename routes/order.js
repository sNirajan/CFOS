const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { RestrictRoute } = require("../middlewares/auth");

router.get("/:cafeId/review", RestrictRoute, orderController.review);
router.post("/:cafeId/checkout", RestrictRoute, orderController.checkout);
router.post("/:orderId/approve", RestrictRoute, orderController.approve);
router.post("/:orderId/decline", RestrictRoute, orderController.decline);
router.post("/:orderId/ready", RestrictRoute, orderController.ready);

module.exports = router;
