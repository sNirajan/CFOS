const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");

const uri =
  "mongodb+srv://Student:ACS-3909@cluster0.r974llp.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri);

/**
 * GET route to show the form for creating new employee.
 * POST route to store new employee into DB.
 * TODO: Restrict this function only to authenticated admin level user.
 */

router.get("/createEmployee", (req, res) => {
  getCafeList().then((cafeList) => {
    res.status(200).render("./createEmployee.njk", {
      cafeList: cafeList,
    });
  });
});

router.post("/createEmployee", (req, res) => {
  async function insertEmployee() {
    await client.connect();
    const employeeCol = await client.db("cafe's").collection("users");
    return employeeCol.insertOne(req.body);
  }
  insertEmployee();
  res.redirect("/employeeList");
});

/**
 * GET route to show the list of employees.
 * TODO: Restrict to only authenticated admin level users.
 */
router.get("/employeeList", (req, res) => {
  getEmployeeList().then((employeeList) => {
    res.status(200).render("./employeeList.njk", {
      employeeList: employeeList,
    });
  });
});

/**
 * GET route to show the form for editing a Employee.
 * POST route to update the Employee in DB.
 * TODO: Restrict to authenticated admin level users only.
 */

router.get("/employee/:id/edit", (req, res) => {
  getEmployee(req.params["id"]).then((employee) => {
    if (employee == null) {
      res.status(404).sendFile(__dirname + "/public/404.html");
    } else {
      getCafeList().then((cafeList) => {
        res.status(200).render("./editEmployee.njk", {
          employee: employee,
          cafeList: cafeList,
        });
      });
    }
  });
});

router.post("/employee/:id/edit", (req, res) => {
  async function updateEmployee() {
    await client.connect();
    const employeeCol = await client.db("cafe's").collection("users");

    let query = { _id: mongodb.ObjectId(req.params["id"]) };
    let update = {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        position: req.body.position,
        wage: req.body.wage,
        cafe_id: req.body.cafe_id,
        user_level: req.body.user_level,
        note: req.body.note,
      },
    };
    return employeeCol.findOneAndUpdate(query, update, {});
  }
  updateEmployee();
  res.redirect("/employeeList");
});

/**
 * GET Route to delete a particular employee by id.
 * TODO: Restrict to only authenticated admin level users.
 */
router.get("/employee/:id/delete", (req, res) => {
  async function deleteEmployee() {
    await client.connect();
    const employeeCol = client.db("cafe's").collection("users");
    return employeeCol.deleteOne({ _id: mongodb.ObjectId(req.params["id"]) });
  }
  deleteEmployee();
  res.redirect("/employeeList");
});

/**
 * Function to retrieve the entire collection of cafeterias from DB.
 * @returns { [Object] } the list of cafeterias.
 */
async function getCafeList() {
  await client.connect();
  const cafeListCol = client.db("cafe's").collection("cafe_lists");
  const cursor = cafeListCol.find({});
  return await cursor.toArray();
}

/**
 * Function to retrieve Employees List from a DB.
 * @returns { Object } List of the Employees
 */
async function getEmployeeList() {
  await client.connect();
  const employeeCol = client.db("cafe's").collection("users");
  const cursor = employeeCol.find({$or: [{user_level: '1'}, {user_level: '0'}]});
  return await cursor.toArray();
}

/**
 * Function to retrieve a single Employee from a DB.
 * @param { string } empId Id of the Employee to retrieve.
 * @returns { Object } The Employee object.
 */
async function getEmployee(empId) {
  await client.connect();
  const employeeCol = client.db("cafe's").collection("users");
  const cursor = employeeCol.findOne({ _id: mongodb.ObjectId(empId) });
  return await cursor;
}

module.exports = router;
