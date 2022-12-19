const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { auth } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

router.get("/", auth, employeeController.index);
router.get("/create", auth, employeeController.create);
router.post("/insert", auth, csrf, employeeController.insert);
router.get("/:employeeId/edit", auth, employeeController.edit);
router.post("/:employeeId/update", auth, csrf, employeeController.update);
router.post("/:employeeId/delete", auth, csrf, employeeController.deleteEmployee);

module.exports = router;
