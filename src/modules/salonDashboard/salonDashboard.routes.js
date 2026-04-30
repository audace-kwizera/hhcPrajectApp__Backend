const express = require("express");
const router = express.Router();
const service = require("./salonDashboard.service");

const auth = require("../../middlewares/auth.middleware");
const tenant = require("../../middlewares/tenant.middleware");
const role = require("../../middlewares/role.middleware");

// 🔥 DASHBOARD SALON
router.get(
  "/",
  auth,
  tenant,
  role("EMPLOYEE", "PARTNER"),
  async (req, res) => {
    try {
      const data = await service.getSalonDashboard(req.tenant.salon_id);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;