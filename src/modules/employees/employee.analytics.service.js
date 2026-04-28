const pool = require("../../config/db");

// =====================================
// 🔥 CA PAR EMPLOYÉ
// =====================================
const getEmployeeRevenue = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
        u.id,
        u."firstName",
        u."lastName",
        COALESCE(SUM(o.total),0) as revenue,
        COUNT(o.id) as orders
     FROM users u
     LEFT JOIN orders o 
       ON o.employee_id = u.id
     WHERE u.salon_id = $1
     GROUP BY u.id
     ORDER BY revenue DESC`,
    [salon_id]
  );

  return result.rows;
};

// =====================================
// 🔥 PERFORMANCE (MOYENNE)
// =====================================
const getEmployeePerformance = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
        employee_id,
        AVG(total) as avg_ticket,
        COUNT(*) as total_orders
     FROM orders
     WHERE salon_id = $1
     AND employee_id IS NOT NULL
     GROUP BY employee_id`,
    [salon_id]
  );

  return result.rows;
};

module.exports = {
  getEmployeeRevenue,
  getEmployeePerformance
};