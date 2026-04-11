const express = require("express");
const router = express.Router();
const controller = require("./salons.controller");

router.post("/", controller.createSalon);
router.get("/", controller.getSalons);

module.exports = router;