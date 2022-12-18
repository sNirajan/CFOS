const express = require("express");
const router = express.Router();
const cafeController = require("../controllers/cafeController");

router.get("/cafe/create", cafeController.create);
router.post("/cafe/insert", cafeController.insert);
router.get("/cafe/:cafeId", cafeController.index);
router.get("/cafe/:cafeId/edit", cafeController.edit);
router.post("/cafe/:cafeId/update", cafeController.update);
router.get("/cafe/:id/delete", cafeController.deleteCafe);

module.exports = router;
