const pool = require("../../config/db");

const createEmployee = async (data) => {
  const { user_id, salon_id, role } = data;

  const result = await pool.query(
    `INSERT INTO employees (user_id, salon_id, role)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [user_id, salon_id, role]
  );

  return result.rows[0];
};

const getEmployees = async () => {
  const result = await pool.query(`
    SELECT e.*, u.email, s.name as salon_name
    FROM employees e
    JOIN users u ON e.user_id = u.id
    JOIN salons s ON e.salon_id = s.id
  `);

  return result.rows;
};

module.exports = { createEmployee, getEmployees };