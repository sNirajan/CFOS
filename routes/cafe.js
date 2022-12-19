const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");
const { auth } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/create", auth, cafeController.create);
router.post("/insert", auth, csrf, cafeController.insert);
router.get("/:cafeId", auth, cafeController.index);
router.get("/:cafeId/edit", auth, cafeController.edit);
router.post("/:cafeId/update", auth, csrf, cafeController.update);
router.post("/:cafeId/delete", auth, csrf, cafeController.deleteCafe);

module.exports = router;
