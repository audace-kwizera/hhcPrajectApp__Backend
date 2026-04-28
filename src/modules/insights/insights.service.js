const pool = require("../../config/db");

// =====================================
// 🔥 GLOBAL INSIGHTS
// =====================================
const getInsights = async (salon_id) => {

  // 🔥 CA total
  const revenueResult = await pool.query(
    `SELECT COALESCE(SUM(total),0) as revenue
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  // 🔥 commandes
  const ordersResult = await pool.query(
    `SELECT COUNT(*) as orders
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  // 🔥 top employé
  const topEmployee = await pool.query(
    `SELECT 
        u.id,
        u."firstName",
        u."lastName",
        COALESCE(SUM(o.total),0) as revenue
     FROM users u
     LEFT JOIN orders o ON o.employee_id = u.id
     WHERE u.salon_id = $1
     GROUP BY u.id
     ORDER BY revenue DESC
     LIMIT 1`,
    [salon_id]
  );

  // 🔥 CA cette semaine
  const weekly = await pool.query(
    `SELECT COALESCE(SUM(total),0) as revenue
     FROM orders
     WHERE salon_id = $1
     AND created_at >= NOW() - INTERVAL '7 days'`,
    [salon_id]
  );

  // 🔥 CA semaine précédente
  const lastWeek = await pool.query(
    `SELECT COALESCE(SUM(total),0) as revenue
     FROM orders
     WHERE salon_id = $1
     AND created_at BETWEEN NOW() - INTERVAL '14 days'
     AND NOW() - INTERVAL '7 days'`,
    [salon_id]
  );

  const currentWeek = Number(weekly.rows[0].revenue);
  const previousWeek = Number(lastWeek.rows[0].revenue);

  let trend = "stable";

  if (currentWeek > previousWeek) trend = "up";
  if (currentWeek < previousWeek) trend = "down";

  return {
    revenue: revenueResult.rows[0].revenue,
    orders: ordersResult.rows[0].orders,
    trend,
    top_employee: topEmployee.rows[0] || null
  };
};

module.exports = {
  getInsights
};