const express = require("express");
const router = express.Router();
const controller = require("./employees.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

router.post("/", auth, role(["ADMIN"]), controller.createEmployee);
router.get("/", controller.getEmployees);

module.exports = router;