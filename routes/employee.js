const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { auth } = require("../middlewares/auth");

router.get("/", auth, employeeController.index);
router.get("/create", auth, employeeController.create);
router.post("/insert", auth, employeeController.insert);
router.get("/:employeeId/edit", auth, employeeController.edit);
router.post("/:employeeId/update", auth, employeeController.update);
router.post("/:employeeId/delete", auth, employeeController.deleteEmployee);

module.exports = router;
