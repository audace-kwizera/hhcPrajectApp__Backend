const pool = require("../../config/db");

// =====================================
// 🔥 GLOBAL FINANCE KPIs
// =====================================
const getFinanceStats = async () => {
  const result = await pool.query(`
    SELECT
      COALESCE(SUM(total),0) as total_revenue,
      COALESCE(SUM(commission_amount),0) as hhc_revenue,
      COALESCE(SUM(salon_earning),0) as salons_revenue
    FROM orders
  `);

  const payouts = await pool.query(`
    SELECT
      COALESCE(SUM(amount),0) as total_paid
    FROM payouts
    WHERE status = 'PAID'
  `);

  const pending = await pool.query(`
    SELECT
      COALESCE(SUM(amount),0) as pending_payouts
    FROM payouts
    WHERE status = 'PENDING'
  `);

  return {
    ...result.rows[0],
    total_paid: payouts.rows[0].total_paid,
    pending_payouts: pending.rows[0].pending_payouts
  };
};

// =====================================
// 🔥 MONTHLY REVENUE (GRAPH)
// =====================================
const getMonthlyRevenue = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', created_at) as month,
      SUM(total) as revenue,
      SUM(commission_amount) as hhc_revenue
    FROM orders
    GROUP BY month
    ORDER BY month ASC
  `);

  return result.rows;
};

// =====================================
// 🔥 TOP SALONS (PERFORMANCE)
// =====================================
const getTopSalons = async () => {
  const result = await pool.query(`
    SELECT 
      s.id,
      s.name,
      COALESCE(SUM(o.total),0) as revenue
    FROM salons s
    LEFT JOIN orders o ON o.salon_id = s.id
    GROUP BY s.id
    ORDER BY revenue DESC
    LIMIT 10
  `);

  return result.rows;
};

// =====================================
// 🔥 PAYOUT STATUS
// =====================================
const getPayoutOverview = async () => {
  const result = await pool.query(`
    SELECT 
      status,
      COUNT(*) as count,
      SUM(amount) as total
    FROM payouts
    GROUP BY status
  `);

  return result.rows;
};

module.exports = {
  getFinanceStats,
  getMonthlyRevenue,
  getTopSalons,
  getPayoutOverview
};