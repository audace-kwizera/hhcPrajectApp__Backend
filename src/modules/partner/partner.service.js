const pool = require("../../config/db");

// =====================================
// 🔥 DASHBOARD SALON
// =====================================
const getPartnerDashboard = async (salon_id) => {
  // 🔥 TOTAL REVENUE
  const revenue = await pool.query(
    `SELECT COALESCE(SUM(total),0) as total
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  // 🔥 THIS MONTH
  const monthly = await pool.query(
    `SELECT COALESCE(SUM(total),0) as total
     FROM orders
     WHERE salon_id = $1
     AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`,
    [salon_id]
  );

  // 🔥 COMMISSIONS
  const commissions = await pool.query(
    `SELECT COALESCE(SUM(commission_amount),0) as total
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  // 🔥 NET EARNED
  const earnings = await pool.query(
    `SELECT COALESCE(SUM(salon_earning),0) as total
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  // 🔥 PENDING PAYOUT
  const pending = await pool.query(
    `SELECT COALESCE(SUM(salon_earning),0) as total
     FROM orders
     WHERE salon_id = $1
     AND payout_id IS NULL`,
    [salon_id]
  );

  return {
    revenue: revenue.rows[0].total,
    monthly: monthly.rows[0].total,
    commissions: commissions.rows[0].total,
    earnings: earnings.rows[0].total,
    pending: pending.rows[0].total
  };
};

module.exports = {
  getPartnerDashboard
};