const express = require("express");
const router = express.Router();
const service = require("./appointments.service");
const auth = require("../../middlewares/auth.middleware");

router.post("/", auth, async (req, res) => {
  try {
    const appointment = await service.createAppointment(req.body);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const data = await service.getAppointments();
  res.json(data);
});

router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const data = await service.updateStatus(req.params.id, status);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;