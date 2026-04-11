const pool = require("../../config/db");
const loyaltyService = require("../loyalty/loyalty.service");

const createOrder = async (data) => {
  const {
    client_id,
    salon_id,
    appointment_id,
    items,
    payment_method
  } = data;

  if (!client_id || !salon_id || !items || items.length === 0) {
    throw new Error("Missing required fields");
  }

  // 🔥 CALCUL TOTAL
  const total = items.reduce((sum, item) => {
    return sum + Number(item.price) * (item.quantity || 1);
  }, 0);

  // 🔥 CREATE ORDER
  const orderResult = await pool.query(
    `INSERT INTO orders 
    (client_id, salon_id, appointment_id, total, payment_method)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [client_id, salon_id, appointment_id || null, total, payment_method]
  );

  const order = orderResult.rows[0];

  // 🔥 INSERT ITEMS
  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items 
      (order_id, name, type, price, quantity)
      VALUES ($1,$2,$3,$4,$5)`,
      [
        order.id,
        item.name,
        item.type,
        item.price,
        item.quantity || 1
      ]
    );
  }

  // 🔥 LOYALTY (ex: 1€ = 1 point)
  try {
    await loyaltyService.addPoints(client_id, Math.floor(total));
  } catch (err) {
    console.error("Loyalty error:", err.message);
  }

  return order;
};

const getOrders = async () => {
  const result = await pool.query("SELECT * FROM orders");
  return result.rows;
};

module.exports = { createOrder, getOrders };