const pool = require("../../config/db");

// 🔥 ADD STOCK
const addStock = async ({ product_id, salon_id, quantity }) => {
  if (!product_id || !salon_id || !quantity) {
    throw new Error("Missing fields");
  }

  const result = await pool.query(
    `INSERT INTO inventory (product_id, salon_id, quantity)
     VALUES ($1,$2,$3)
     ON CONFLICT (product_id, salon_id)
     DO UPDATE 
     SET quantity = inventory.quantity + $3,
         updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [product_id, salon_id, quantity]
  );

  return result.rows[0];
};

// 🔥 GET STOCK BY SALON
const getSalonStock = async (salon_id) => {
  const result = await pool.query(
    `SELECT * FROM inventory WHERE salon_id=$1`,
    [salon_id]
  );

  return result.rows;
};

// 🔥 LOW STOCK ALERT
const getLowStock = async (salon_id) => {
  const result = await pool.query(
    `SELECT * FROM inventory 
     WHERE salon_id=$1 AND quantity <= min_quantity`,
    [salon_id]
  );

  return result.rows;
};

module.exports = {
  addStock,
  getSalonStock,
  getLowStock
};