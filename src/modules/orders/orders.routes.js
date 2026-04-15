const express = require("express");
const router = express.Router();
const service = require("./orders.service");
const auth = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");


// 🔥 CREATE ORDER → EMPLOYEE / PARTNER (POS)
router.post(
  "/",
  auth,
  checkRole("EMPLOYEE", "PARTNER"),
  async (req, res) => {
    try {
      const order = await service.createOrder(req.body);
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
  checkRole("ADMIN"),
  async (req, res) => {
    const data = await service.getOrders();
    res.json(data);
  }
);


module.exports = router;