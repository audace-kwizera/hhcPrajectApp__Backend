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

module.exports = {
  getGlobalStats,
  getRevenueBySalon,
  getTopClients,
  getLowStockGlobal,
  getRecentOrders
};