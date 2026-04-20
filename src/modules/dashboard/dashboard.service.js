const pool = require("../../config/db");

// 🔥 GLOBAL STATS
const getGlobalStats = async () => {
  const totalRevenue = await pool.query(
    `SELECT COALESCE(SUM(total),0) as revenue FROM orders`
  );

  const totalOrders = await pool.query(
    `SELECT COUNT(*) FROM orders`
  );

  const totalUsers = await pool.query(
    `SELECT COUNT(*) FROM users`
  );

  const totalSalons = await pool.query(
    `SELECT COUNT(*) FROM salons`
  );

  return {
    revenue: totalRevenue.rows[0].revenue,
    orders: totalOrders.rows[0].count,
    users: totalUsers.rows[0].count,
    salons: totalSalons.rows[0].count
  };
};

// 🔥 REVENUE BY SALON
const getRevenueBySalon = async () => {
  const result = await pool.query(
    `SELECT s.id, s.name, COALESCE(SUM(o.total),0) as revenue
     FROM salons s
     LEFT JOIN orders o ON o.salon_id = s.id
     GROUP BY s.id
     ORDER BY revenue DESC`
  );

  return result.rows;
};

// 🔥 TOP CLIENTS
const getTopClients = async () => {
  const result = await pool.query(
    `SELECT u.id, u.email, COALESCE(SUM(o.total),0) as total_spent
     FROM users u
     LEFT JOIN orders o ON o.client_id = u.id
     GROUP BY u.id
     ORDER BY total_spent DESC
     LIMIT 10`
  );

  return result.rows;
};

// 🔥 LOW STOCK GLOBAL
const getLowStockGlobal = async () => {
  const result = await pool.query(
    `SELECT * FROM inventory 
     WHERE quantity <= min_quantity`
  );

  return result.rows;
};

// 🔥 RECENT ORDERS
const getRecentOrders = async () => {
  const result = await pool.query(
    `SELECT * FROM orders 
     ORDER BY created_at DESC 
     LIMIT 10`
  );

  return result.rows;
};

// ======================================
// 🔥 SALON DASHBOARD (MULTI-TENANT)
// ======================================
const getSalonDashboard = async (tenant) => {
  const salon_id = tenant.salon_id;

  if (!tenant.isAdmin && !salon_id) {
    throw new Error("No salon assigned");
  }

  const param = tenant.isAdmin ? [] : [salon_id];

  const filter = tenant.isAdmin
    ? ""
    : "WHERE salon_id = $1";

  // 🔥 CA TOTAL
  const revenue = await pool.query(
    `
    SELECT COALESCE(SUM(total),0) as revenue
    FROM orders
    ${filter}
    `,
    param
  );

  // 🔥 ORDERS
  const orders = await pool.query(
    `
    SELECT COUNT(*) as total_orders
    FROM orders
    ${filter}
    `,
    param
  );

  // 🔥 TODAY
  const today = await pool.query(
    `
    SELECT COALESCE(SUM(total),0) as today_revenue
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE
    ${tenant.isAdmin ? "" : "AND salon_id = $1"}
    `,
    param
  );

  // 🔥 TOP SERVICES (SECURE JOIN)
  const topServices = await pool.query(
    `
    SELECT oi.name, COUNT(*) as total
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.type = 'SERVICE'
    ${tenant.isAdmin ? "" : "AND o.salon_id = $1"}
    GROUP BY oi.name
    ORDER BY total DESC
    LIMIT 5
    `,
    param
  );

  // 🔥 TOP PRODUCTS
  const topProducts = await pool.query(
    `
    SELECT oi.name, COUNT(*) as total
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE oi.type = 'PRODUCT'
    ${tenant.isAdmin ? "" : "AND o.salon_id = $1"}
    GROUP BY oi.name
    ORDER BY total DESC
    LIMIT 5
    `,
    param
  );

  // 🔥 REVIEWS
  const reviews = await pool.query(
    `
    SELECT 
      AVG(rating)::numeric(2,1) as avg_rating,
      COUNT(*) as total_reviews
    FROM reviews
    ${filter}
    `,
    param
  );

  return {
    revenue: revenue.rows[0],
    orders: orders.rows[0],
    today: today.rows[0],
    topServices: topServices.rows,
    topProducts: topProducts.rows,
    reviews: reviews.rows[0]
  };
};

module.exports = {
  getGlobalStats,
  getRevenueBySalon,
  getTopClients,
  getLowStockGlobal,
  getRecentOrders,
  getSalonDashboard 
};