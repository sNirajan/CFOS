const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");

router.get("/create", menuItemController.create);
router.post("/insert", menuItemController.insert);
router.get("/:itemId/edit", menuItemController.edit);
router.post("/:itemId/update", menuItemController.update);
router.get("/:itemId/delete", menuItemController.deleteMenuItem);

module.exports = router;
