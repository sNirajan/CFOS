const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/", employeeController.index);
router.get("/create", employeeController.create);
router.post("/insert", employeeController.insert);
router.get("/:employeeId/edit", employeeController.edit);
router.post("/:employeeId/update", employeeController.update);
router.get("/:employeeId/delete", employeeController.deleteEmployee);

module.exports = router;
