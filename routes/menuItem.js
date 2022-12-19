const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");
const { RestrictRoute } = require("../middlewares/auth");

router.get("/create", RestrictRoute, menuItemController.create);
router.post("/insert", RestrictRoute, menuItemController.insert);
router.get("/:itemId/edit", RestrictRoute, menuItemController.edit);
router.post("/:itemId/update", RestrictRoute, menuItemController.update);
router.get("/:itemId/delete", RestrictRoute, menuItemController.deleteMenuItem);

module.exports = router;
