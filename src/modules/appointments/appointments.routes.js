// const express = require("express");
// const router = express.Router();
// const service = require("./appointments.service");
// const auth = require("../../middlewares/auth.middleware");


// router.post("/", async (req, res) => {
//   const data = await service.createAppointment(req.body);
//   res.json(data);
// });

// router.get("/", async (req, res) => {
//   const data = await service.getAppointments();
//   res.json(data);
// });

// module.exports = router;

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

module.exports = router;