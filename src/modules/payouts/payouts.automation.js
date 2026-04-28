const pool = require("../../config/db");

// =====================================
// 🔥 GET ALL SALONS
// =====================================
const getAllSalons = async () => {
  const result = await pool.query(`SELECT id FROM salons`);
  return result.rows;
};

// =====================================
// 🔥 GENERATE PERIOD (MONTH)
// =====================================
const getMonthPeriod = () => {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return { start, end };
};

// =====================================
// 🔥 GENERATE PAYOUTS FOR ALL SALONS
// =====================================
const generateMonthlyPayouts = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const salons = await getAllSalons();
    const { start, end } = getMonthPeriod();

    const createdPayouts = [];

    for (const salon of salons) {

      // 🔥 GET ELIGIBLE ORDERS
      const orders = await client.query(
        `SELECT id, salon_earning
         FROM orders
         WHERE salon_id = $1
         AND payout_id IS NULL
         AND created_at BETWEEN $2 AND $3
         FOR UPDATE`,
        [salon.id, start, end]
      );

      if (orders.rows.length === 0) continue;

      // 🔥 TOTAL
      const total = orders.rows.reduce((sum, o) => {
        return sum + Number(o.salon_earning);
      }, 0);

      // 🔥 CREATE PAYOUT
      const payoutResult = await client.query(
        `INSERT INTO payouts 
        (salon_id, amount, period_start, period_end)
        VALUES ($1,$2,$3,$4)
        RETURNING *`,
        [salon.id, total, start, end]
      );

      const payout = payoutResult.rows[0];

      // 🔥 LINK ORDERS (batch)
      await client.query(
        `UPDATE orders
         SET payout_id = $1
         WHERE salon_id = $2
         AND payout_id IS NULL
         AND created_at BETWEEN $3 AND $4`,
        [payout.id, salon.id, start, end]
      );

      createdPayouts.push(payout);
    }

    await client.query("COMMIT");

    return createdPayouts;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

module.exports = {
  generateMonthlyPayouts
};