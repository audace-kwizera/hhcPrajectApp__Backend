const pool = require("../../config/db");

const addPoints = async (user_id, points) => {
  const result = await pool.query(
    `INSERT INTO loyalty_points (user_id, points)
     VALUES ($1,$2)
     ON CONFLICT (user_id)
     DO UPDATE SET points = loyalty_points.points + $2
     RETURNING *`,
    [user_id, points]
  );

  return result.rows[0];
};

const getPoints = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM loyalty_points WHERE user_id=$1",
    [user_id]
  );

  return result.rows[0];
};

module.exports = { addPoints, getPoints };