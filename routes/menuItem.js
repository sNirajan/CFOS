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

/**
 * Routes for menu item pages.
 * All urls have prefix "/menuItem" attched from server.js. For example, "/insert" is actually "/menuItem/insert".
 * NOTE: Please DO NOT chnage the order of the routes without caution as it may produce errors.
 */
router.get("/create/:cafeId", auth, admin, menuItemController.create);
router.post("/insert", auth, csrf, admin, menuItemController.insert);
router.get("/:itemId/edit", auth, admin, menuItemController.edit);
router.post("/:itemId/update", auth, admin, csrf, menuItemController.update);
router.post("/:itemId/delete", auth, admin, csrf, menuItemController.deleteMenuItem);

module.exports = router;
