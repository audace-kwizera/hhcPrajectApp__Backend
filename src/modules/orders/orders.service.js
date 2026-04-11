const pool = require("../../config/db");
const loyaltyService = require("../loyalty/loyalty.service");

const createOrder = async (data) => {
  const {
    client_id,
    salon_id,
    appointment_id,
    items,
    payment_method,
    payments
  } = data;

  if (!client_id || !salon_id || !items || items.length === 0) {
    throw new Error("Missing required fields");
  }

  // 🔥 CALCUL TOTAL
  const total = items.reduce((sum, item) => {
    return sum + Number(item.price) * (item.quantity || 1);
  }, 0);

  let finalPaymentMethod = payment_method || "UNKNOWN";

  // 🔥 MIXED PAYMENT
  if (payments && payments.length > 0) {
    const totalPaid = payments.reduce((sum, p) => {
      return sum + Number(p.amount);
    }, 0);

    if (totalPaid !== total) {
      throw new Error("Payment total does not match order total");
    }

    finalPaymentMethod =
      payments.length > 1 ? "MIXED" : payments[0].method;
  }

  // 🔥 CREATE ORDER
  const orderResult = await pool.query(
    `INSERT INTO orders 
    (client_id, salon_id, appointment_id, total, payment_method)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [client_id, salon_id, appointment_id || null, total, finalPaymentMethod]
  );

  const order = orderResult.rows[0];

  // 🔥 INSERT ITEMS + STOCK
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

    // =========================
    // 🔥 STOCK MANAGEMENT
    // =========================
    if (item.type === "PRODUCT" && item.product_id) {
      const qty = item.quantity || 1;

      // 🔥 CHECK STOCK EXIST
      const stock = await pool.query(
        `SELECT quantity FROM inventory 
         WHERE product_id=$1 AND salon_id=$2`,
        [item.product_id, salon_id]
      );

      if (stock.rows.length === 0) {
        throw new Error(`Produit ${item.name} non trouvé en stock`);
      }

      // 🔥 CHECK QUANTITY
      if (stock.rows[0].quantity < qty) {
        throw new Error(`Stock insuffisant pour ${item.name}`);
      }

      // 🔥 UPDATE STOCK
      await pool.query(
        `UPDATE inventory 
         SET quantity = quantity - $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE product_id=$2 AND salon_id=$3`,
        [qty, item.product_id, salon_id]
      );
    }
  }

  // 🔥 INSERT PAYMENTS
  if (payments && payments.length > 0) {
    for (const payment of payments) {
      await pool.query(
        `INSERT INTO payments (order_id, method, amount)
         VALUES ($1,$2,$3)`,
        [order.id, payment.method, payment.amount]
      );
    }
  } else if (payment_method) {
    await pool.query(
      `INSERT INTO payments (order_id, method, amount)
       VALUES ($1,$2,$3)`,
      [order.id, payment_method, total]
    );
  }

  // 🔥 UPDATE APPOINTMENT
  if (appointment_id) {
    try {
      await pool.query(
        `UPDATE appointments 
         SET status = 'DONE' 
         WHERE id = $1`,
        [appointment_id]
      );
    } catch (err) {
      console.error("Appointment update error:", err.message);
    }
  }

  // 🔥 LOYALTY
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