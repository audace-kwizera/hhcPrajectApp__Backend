const pool = require("../../config/db");

// =====================================
// 🔥 TOP SERVICES
// =====================================
const getTopServices = async (salon_id) => {
  const result = await pool.query(
    `SELECT name, COUNT(*) as total, SUM(price) as revenue
     FROM order_items
     WHERE type = 'SERVICE'
     AND order_id IN (
       SELECT id FROM orders WHERE salon_id = $1
     )
     GROUP BY name
     ORDER BY revenue DESC
     LIMIT 5`,
    [salon_id]
  );

  return result.rows;
};

// =====================================
// 🔥 TOP PRODUCTS
// =====================================
const getTopProducts = async (salon_id) => {
  const result = await pool.query(
    `SELECT name, SUM(quantity) as sold, SUM(price * quantity) as revenue
     FROM order_items
     WHERE type = 'PRODUCT'
     AND order_id IN (
       SELECT id FROM orders WHERE salon_id = $1
     )
     GROUP BY name
     ORDER BY revenue DESC
     LIMIT 5`,
    [salon_id]
  );

  return result.rows;
};

// =====================================
// 🔥 DAILY REVENUE
// =====================================
const getDailyRevenue = async (salon_id) => {
  const result = await pool.query(
    `SELECT DATE(created_at) as day,
            SUM(total) as revenue
     FROM orders
     WHERE salon_id = $1
     GROUP BY day
     ORDER BY day DESC
     LIMIT 7`,
    [salon_id]
  );

  return result.rows;
};

// =====================================
// 🔥 GROWTH (%)
// =====================================
const getGrowth = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
      SUM(CASE 
        WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        THEN total ELSE 0 END) as current,

      SUM(CASE 
        WHEN DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        THEN total ELSE 0 END) as previous
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  const current = Number(result.rows[0].current);
  const previous = Number(result.rows[0].previous);

  const growth =
    previous === 0 ? 100 : ((current - previous) / previous) * 100;

  return {
    current,
    previous,
    growth: Math.round(growth)
  };
};

module.exports = {
  getTopServices,
  getTopProducts,
  getDailyRevenue,
  getGrowth
};