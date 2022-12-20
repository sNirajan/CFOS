/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */
const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const { auth, admin, employee } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

/**
 * Routes for cafe pages.
 * All urls have prefix "/cafe" attched from server.js. For example, "/create" is actually "/cafe/create".
 * NOTE: Please DO NOT chnage the order of the routes without caution as it may produce errors.
 */
router.get("/create", auth, admin, cafeController.create);
router.post("/insert", auth, admin, csrf, cafeController.insert);
router.get("/:cafeId", auth, cafeController.index);
router.get("/:cafeId/edit", auth, admin, cafeController.edit);
router.post("/:cafeId/update", auth, admin, csrf, cafeController.update);
router.post("/:cafeId/delete", auth, admin, csrf, cafeController.deleteCafe);
router.get("/orderRetriever/:cafeId", auth, employee, cafeController.orderRetriever);
router.post("/:cafeId/startOrders", auth, admin, csrf, cafeController.startOrders);

module.exports = router;
