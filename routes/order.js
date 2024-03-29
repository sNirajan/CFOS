/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { auth, customer, employee } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");
const { openCafe } = require("../middlewares/cafeStatus");

/**
 * Routes for order pages.
 * All urls have prefix "/order" attched from server.js. For example, "/:cafeId/review" is actually "order/:cafeId/review".
 * NOTE: Please DO NOT chnage the order of the routes without caution as it may produce errors.
 */
router.get("/:cafeId/review", auth, openCafe, customer, orderController.review);
router.post("/:cafeId/checkout", auth, openCafe, customer, csrf, orderController.checkout);
router.post("/:orderId/update", auth, employee, csrf, orderController.update);
router.get("/:orderId/track", auth, customer, orderController.track);
router.get("/tracker/:orderId", auth, customer, orderController.tracker);

module.exports = router;
