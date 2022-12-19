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

router.get("/create", auth, admin, cafeController.create);
router.post("/insert", auth, admin, csrf, cafeController.insert);
router.get("/:cafeId", auth, cafeController.index);
router.get("/:cafeId/edit", auth, admin, cafeController.edit);
router.post("/:cafeId/update", auth, admin, csrf, cafeController.update);
router.post("/:cafeId/delete", auth, admin, csrf, cafeController.deleteCafe);
router.get("/orderRetriever/:cafeId", auth, employee, cafeController.orderRetriever);
router.post("/:cafeId/startOrders", auth, admin, csrf, cafeController.startOrders);

module.exports = router;
