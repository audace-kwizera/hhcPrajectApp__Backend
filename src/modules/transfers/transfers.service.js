const pool = require("../../config/db");

const transferStock = async (data) => {
  const {
    product_id,
    from_salon_id,
    to_salon_id,
    quantity
  } = data;

  if (!product_id || !from_salon_id || !to_salon_id || !quantity) {
    throw new Error("Missing fields");
  }

  if (from_salon_id === to_salon_id) {
    throw new Error("Cannot transfer to same salon");
  }

  // 🔥 CHECK STOCK SOURCE
  const source = await pool.query(
    `SELECT quantity FROM inventory 
     WHERE product_id=$1 AND salon_id=$2`,
    [product_id, from_salon_id]
  );

  if (source.rows.length === 0) {
    throw new Error("Source stock not found");
  }

  if (source.rows[0].quantity < quantity) {
    throw new Error("Not enough stock");
  }

  // 🔥 START TRANSACTION
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 🔻 REMOVE FROM SOURCE
    await client.query(
      `UPDATE inventory
       SET quantity = quantity - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE product_id=$2 AND salon_id=$3`,
      [quantity, product_id, from_salon_id]
    );

    // 🔺 ADD TO DESTINATION
    await client.query(
      `INSERT INTO inventory (product_id, salon_id, quantity)
       VALUES ($1,$2,$3)
       ON CONFLICT (product_id, salon_id)
       DO UPDATE 
       SET quantity = inventory.quantity + $3,
           updated_at = CURRENT_TIMESTAMP`,
      [product_id, to_salon_id, quantity]
    );

    // 🧾 LOG TRANSFER
    const result = await client.query(
      `INSERT INTO inventory_transfers 
      (product_id, from_salon_id, to_salon_id, quantity)
      VALUES ($1,$2,$3,$4)
      RETURNING *`,
      [product_id, from_salon_id, to_salon_id, quantity]
    );

    await client.query("COMMIT");

    return result.rows[0];

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

const getTransfers = async () => {
  const result = await pool.query(
    "SELECT * FROM inventory_transfers ORDER BY created_at DESC"
  );
  return result.rows;
};

module.exports = { transferStock, getTransfers };