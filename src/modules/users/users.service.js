const pool = require("../../config/db");

const getAllUsers = async () => {
  const result = await pool.query("SELECT id,email,role FROM users");
  return result.rows;
};

module.exports = { getAllUsers };