const express = require("express");
const router = express.Router();
const controller = require("./users.controller");
const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");

router.get("/", auth, role(["ADMIN"]), controller.getUsers);

module.exports = router;