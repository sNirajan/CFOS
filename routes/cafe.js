const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const { RESTRICT } = require("../middlewares/auth");

router.get("/create", RESTRICT, cafeController.create);
router.post("/insert", cafeController.insert);
router.get("/:cafeId", cafeController.index);
router.get("/:cafeId/edit", cafeController.edit);
router.post("/:cafeId/update", cafeController.update);
router.get("/:id/delete", cafeController.deleteCafe);

module.exports = router;
