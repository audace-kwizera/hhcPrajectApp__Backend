const express = require("express");
const router = express.Router();
const controller = require("./salons.controller");
const auth = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");

// 🔥 CREATE SALON → ADMIN 
router.post("/", auth, checkRole("ADMIN"), controller.createSalon);

// 🔥 PUBLIC
router.get("/", controller.getSalons);
router.get("/ranking", controller.getRankedSalons);

module.exports = router;