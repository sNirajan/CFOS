const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { RestrictRoute } = require("../middlewares/auth");

router.get("/", RestrictRoute, employeeController.index);
router.get("/create", RestrictRoute, employeeController.create);
router.post("/insert", RestrictRoute, employeeController.insert);
router.get("/:employeeId/edit", RestrictRoute, employeeController.edit);
router.post("/:employeeId/update", RestrictRoute, employeeController.update);
router.get("/:employeeId/delete", RestrictRoute, employeeController.deleteEmployee);

module.exports = router;
