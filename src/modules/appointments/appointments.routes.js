const express = require("express");
const router = express.Router();
const service = require("./appointments.service");

router.post("/", async (req, res) => {
  const data = await service.createAppointment(req.body);
  res.json(data);
});

router.get("/", async (req, res) => {
  const data = await service.getAppointments();
  res.json(data);
});

module.exports = router;