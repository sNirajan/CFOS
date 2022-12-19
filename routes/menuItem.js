const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");
const { auth } = require("../middlewares/auth");

router.get("/create", auth, menuItemController.create);
router.post("/insert", auth, menuItemController.insert);
router.get("/:itemId/edit", auth, menuItemController.edit);
router.post("/:itemId/update", auth, menuItemController.update);
router.post("/:itemId/delete", auth, menuItemController.deleteMenuItem);

module.exports = router;
