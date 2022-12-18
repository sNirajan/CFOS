const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.get("/employee", employeeController.index);
router.get("/employee/create", employeeController.create);
router.post("/employee/insert", employeeController.insert);
router.get("/employee/:employeeId/edit", employeeController.edit);
router.post("/employee/:employeeId/update", employeeController.update);
router.get("/employee/:employeeId/delete", employeeController.deleteEmployee);

module.exports = router;
