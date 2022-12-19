const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const { RestrictRoute } = require("../middlewares/auth");

router.get("/create", RestrictRoute, cafeController.create);
router.post("/insert", RestrictRoute, cafeController.insert);
router.get("/:cafeId", RestrictRoute, cafeController.index);
router.get("/:cafeId/edit", RestrictRoute, cafeController.edit);
router.post("/:cafeId/update", RestrictRoute, cafeController.update);
router.get("/:id/delete", RestrictRoute, cafeController.deleteCafe);

module.exports = router;
