const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");

router.get("/menuItem/create", menuItemController.create);
router.post("/menuItem/insert", menuItemController.insert);
router.get("/menuItem/:itemId/edit", menuItemController.edit);
router.post("/menuItem/:itemId/update", menuItemController.update);
router.get("/menuItem/:itemId/delete", menuItemController.deleteMenuItem);

module.exports = router;
