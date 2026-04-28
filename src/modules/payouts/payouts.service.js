// const pool = require("../../config/db");

// // =====================================
// // 🔥 CALCUL DUE AMOUNT (SALON)
// // =====================================
// const getSalonDue = async (salon_id) => {
//   const result = await pool.query(
//     `SELECT COALESCE(SUM(salon_earning),0) as due
//      FROM orders
//      WHERE salon_id = $1
//      AND payout_id IS NULL`,
//     [salon_id]
//   );

//   return result.rows[0];
// };


// // =====================================
// // 🔥 CREATE PAYOUT
// // =====================================
// const createPayout = async (salon_id) => {
//   // 1. récupérer commandes non payées
//   const orders = await pool.query(
//     `SELECT id, salon_earning 
//      FROM orders 
//      WHERE salon_id = $1 
//      AND payout_id IS NULL`,
//     [salon_id]
//   );

//   if (orders.rows.length === 0) {
//     throw new Error("No pending payouts");
//   }

//   // 2. calcul total
//   const total = orders.rows.reduce((sum, o) => {
//     return sum + Number(o.salon_earning);
//   }, 0);

//   // 3. créer payout
//   const payoutResult = await pool.query(
//     `INSERT INTO payouts (salon_id, amount)
//      VALUES ($1,$2)
//      RETURNING *`,
//     [salon_id, total]
//   );

//   const payout = payoutResult.rows[0];

//   // 4. lier commandes
//   for (const order of orders.rows) {
//     await pool.query(
//       `UPDATE orders 
//        SET payout_id = $1
//        WHERE id = $2`,
//       [payout.id, order.id]
//     );
//   }

//   return payout;
// };


// // =====================================
// // 🔥 MARK AS PAID
// // =====================================
// const markAsPaid = async (payout_id) => {
//   const result = await pool.query(
//     `UPDATE payouts
//      SET status = 'PAID',
//          paid_at = CURRENT_TIMESTAMP
//      WHERE id = $1
//      RETURNING *`,
//     [payout_id]
//   );

//   return result.rows[0];
// };


// // =====================================
// // 🔥 GET PAYOUTS
// // =====================================
// const getPayouts = async () => {
//   const result = await pool.query(
//     `SELECT * FROM payouts ORDER BY created_at DESC`
//   );

//   return result.rows;
// };

// module.exports = {
//   getSalonDue,
//   createPayout,
//   markAsPaid,
//   getPayouts
// };

const pool = require("../../config/db");

// =====================================
// 🔥 CALCUL DUE AMOUNT (SALON)
// =====================================
const getSalonDue = async (salon_id) => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(salon_earning),0) as due
     FROM orders
     WHERE salon_id = $1
     AND payout_id IS NULL`,
    [salon_id]
  );

  return result.rows[0];
};


// =====================================
// 🔥 CREATE PAYOUT
// =====================================
const createPayout = async (salon_id) => {
  // 1. récupérer commandes non payées
  const orders = await pool.query(
    `SELECT id, salon_earning 
     FROM orders 
     WHERE salon_id = $1 
     AND payout_id IS NULL`,
    [salon_id]
  );

  if (orders.rows.length === 0) {
    throw new Error("No pending payouts");
  }

  // 2. calcul total
  const total = orders.rows.reduce((sum, o) => {
    return sum + Number(o.salon_earning);
  }, 0);

  // 3. créer payout
  const payoutResult = await pool.query(
    `INSERT INTO payouts (salon_id, amount)
     VALUES ($1,$2)
     RETURNING *`,
    [salon_id, total]
  );

  const payout = payoutResult.rows[0];

  // 4. lier commandes
  for (const order of orders.rows) {
    await pool.query(
      `UPDATE orders 
       SET payout_id = $1
       WHERE id = $2`,
      [payout.id, order.id]
    );
  }

  return payout;
};


// =====================================
// 🔥 MARK AS PAID
// =====================================
const markAsPaid = async (payout_id) => {
  const result = await pool.query(
    `UPDATE payouts
     SET status = 'PAID',
         paid_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING *`,
    [payout_id]
  );

  return result.rows[0];
};


// =====================================
// 🔥 GET PAYOUTS
// =====================================
const getPayouts = async () => {
  const result = await pool.query(
    `SELECT * FROM payouts ORDER BY created_at DESC`
  );

  return result.rows;
};

module.exports = {
  getSalonDue,
  createPayout,
  markAsPaid,
  getPayouts
};