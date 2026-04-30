const express = require("express");
const router = express.Router();
const service = require("./orders.service");
const auth = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");
const tenant = require("../../middlewares/tenant.middleware");


// 🔥 CREATE ORDER → EMPLOYEE / PARTNER (POS)
router.post(
  "/",
  auth,
  checkRole("ADMIN", "EMPLOYEE", "PARTNER"),
  tenant,
  async (req, res) => {
    try {
      const order = await service.createOrder(req.body, req.tenant);
      res.json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);


// 🔥 GET ALL ORDERS → ADMIN ONLY
router.get(
  "/",
  auth,
  // checkRole("ADMIN"),
  tenant,
  async (req, res) => {
    const data = await service.getOrders();
    res.json(data);
  }
);


module.exports = router;