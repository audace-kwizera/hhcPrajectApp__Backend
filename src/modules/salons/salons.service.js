const pool = require("../../config/db");

const createSalon = async (data) => {
  const { name, address, city, owner_id } = data;

  const result = await pool.query(
    `INSERT INTO salons (name, address, city, owner_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [name, address, city, owner_id]
  );

  return result.rows[0];
};

const getSalons = async () => {
  const result = await pool.query("SELECT * FROM salons");
  return result.rows;
};

module.exports = { createSalon, getSalons };