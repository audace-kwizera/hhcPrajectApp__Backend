const express = require("express");
const router = express.Router();
const service = require("./payouts.service");

const auth = require("../../middlewares/auth.middleware");
const role = require("../../middlewares/role.middleware");
const tenant = require("../../middlewares/tenant.middleware");

const automation = require("./payouts.automation");


// 🔥 SALON → voir combien il doit recevoir
router.get(
  "/due",
  auth,
  tenant,
  role("ADMIN", "EMPLOYEE", "PARTNER"),
  async (req, res) => {
    const data = await service.getSalonDue(req.tenant.salon_id);
    res.json(data);
  }
);


// 🔥 ADMIN → créer payout
router.post(
  "/:salon_id",
  auth,
  role("ADMIN"),
  async (req, res) => {
    try {
      const payout = await service.createPayout(req.params.salon_id);
      res.json(payout);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);


// 🔥 ADMIN → payer
router.post(
  "/pay/:id",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.markAsPaid(req.params.id);
    res.json(data);
  }
);


// 🔥 ADMIN → list
router.get(
  "/",
  auth,
  role("ADMIN"),
  async (req, res) => {
    const data = await service.getPayouts();
    res.json(data);
  }
);

// 🔥 ADMIN → GENERATE PAYOUTS
router.post(
  "/generate",
  auth,
  role("ADMIN"),
  async (req, res) => {
    try {
      const data = await automation.generateMonthlyPayouts();
      res.json(data);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;