const pool = require("../../config/db");

const getSalonDashboard = async (salon_id) => {

  // =====================================
  // 💰 CA AUJOURD’HUI
  // =====================================
  const todayRevenue = await pool.query(
    `SELECT COALESCE(SUM(total),0) as revenue
     FROM orders
     WHERE salon_id = $1
     AND DATE(created_at) = CURRENT_DATE`,
    [salon_id]
  );

  // =====================================
  // 📅 RDV AUJOURD’HUI
  // =====================================
  const todayAppointments = await pool.query(
    `SELECT COUNT(*) as count
     FROM appointments
     WHERE salon_id = $1
     AND DATE(start_time) = CURRENT_DATE`,
    [salon_id]
  );

  // =====================================
  // 🧑‍🎨 TOP EMPLOYÉ (SEMAINE)
  // =====================================
  const topEmployee = await pool.query(
    `SELECT 
        u.id,
        u."firstName",
        u."lastName",
        COALESCE(SUM(o.total),0) as revenue
     FROM users u
     LEFT JOIN orders o 
        ON o.employee_id = u.id
        AND o.created_at >= NOW() - INTERVAL '7 days'
     WHERE u.salon_id = $1
     GROUP BY u.id
     ORDER BY revenue DESC
     LIMIT 1`,
    [salon_id]
  );

  // =====================================
  // 📦 STOCK BAS
  // =====================================
  const lowStock = await pool.query(
    `SELECT product_id, quantity
     FROM inventory
     WHERE salon_id = $1
     AND quantity < 5
     ORDER BY quantity ASC
     LIMIT 5`,
    [salon_id]
  );

  // =====================================
  // 💸 CASHFLOW
  // =====================================
  const earnings = await pool.query(
    `SELECT COALESCE(SUM(salon_earning),0) as total
     FROM orders
     WHERE salon_id = $1`,
    [salon_id]
  );

  const paid = await pool.query(
    `SELECT COALESCE(SUM(amount),0) as total
     FROM payouts
     WHERE salon_id = $1
     AND status = 'PAID'`,
    [salon_id]
  );

  const due = Number(earnings.rows[0].total) - Number(paid.rows[0].total);

  // =====================================
  // 🔁 RETURN
  // =====================================
  return {
    today_revenue: todayRevenue.rows[0].revenue,
    appointments_today: todayAppointments.rows[0].count,
    top_employee: topEmployee.rows[0] || null,
    low_stock: lowStock.rows,
    cashflow: {
      total_earned: earnings.rows[0].total,
      total_paid: paid.rows[0].total,
      due
    }
  };
};

module.exports = {
  getSalonDashboard
};