const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const { auth } = require("../middlewares/auth");

router.get("/create", auth, cafeController.create);
router.post("/insert", auth, cafeController.insert);
router.get("/:cafeId", auth, cafeController.index);
router.get("/:cafeId/edit", auth, cafeController.edit);
router.post("/:cafeId/update", auth, cafeController.update);
router.post("/:cafeId/delete", auth, cafeController.deleteCafe);

module.exports = router;
