/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */

const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");
const { auth, admin } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/create/:cafeId", auth, admin, menuItemController.create);
router.post("/insert", auth, csrf, admin, menuItemController.insert);
router.get("/:itemId/edit", auth, admin, menuItemController.edit);
router.post("/:itemId/update", auth, admin, csrf, menuItemController.update);
router.post("/:itemId/delete", auth, admin, csrf, menuItemController.deleteMenuItem);

module.exports = router;
