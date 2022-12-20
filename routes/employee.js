/**
 * Reza Saker Hossain
 * Gagandeep Singh
 * Niranjan Shah
 */
const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { auth, admin } = require("../middlewares/auth");
const { csrf } = require("../middlewares/guard");

/**
 * Routes for employee pages.
 * All urls have prefix "/employee" attched from server.js. For example, "/create" is actually "/employee/create".
 * NOTE: Please DO NOT chnage the order of the routes without caution as it may produce errors.
 */
router.get("/", auth, admin, employeeController.index);
router.get("/create", auth, admin, employeeController.create);
router.post("/insert", auth, admin, csrf, employeeController.insert);
router.get("/:employeeId/edit", auth, admin, employeeController.edit);
router.post("/:employeeId/update", auth, admin, csrf, employeeController.update);
router.post("/:employeeId/delete", auth, admin, csrf, employeeController.deleteEmployee);

module.exports = router;
