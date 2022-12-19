const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");
const { auth } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/create", auth, menuItemController.create);
router.post("/insert", auth, csrf, menuItemController.insert);
router.get("/:itemId/edit", auth, menuItemController.edit);
router.post("/:itemId/update", auth, csrf, menuItemController.update);
router.post("/:itemId/delete", auth, csrf, menuItemController.deleteMenuItem);

module.exports = router;
