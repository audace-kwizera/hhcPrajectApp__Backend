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

// const getRankedSalons = async () => {
  
//   const result = await pool.query(`
//     SELECT 
//       s.*,

//       COALESCE(AVG(r.rating), 0) as avg_rating,
//       COUNT(DISTINCT r.id) as total_reviews,
//       COUNT(DISTINCT o.id) as total_orders,

//       (
//         (COALESCE(AVG(r.rating), 0) * 0.5)
//         + (LOG(COUNT(DISTINCT r.id) + 1) * 0.2)
//         + (LOG(COUNT(DISTINCT o.id) + 1) * 0.3)
//       ) as score

//     FROM salons s

//     LEFT JOIN reviews r ON r.salon_id = s.id
//     LEFT JOIN orders o ON o.salon_id = s.id

//     GROUP BY s.id
//     ORDER BY score DESC
//   `);

//   return result.rows;
// };

const getRankedSalons = async (city) => {
  let query = `
    SELECT 
      s.*,

      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(DISTINCT r.id) as total_reviews,
      COUNT(DISTINCT o.id) as total_orders,

      (
        (COALESCE(AVG(r.rating), 0) * 0.5)
        + (LOG(COUNT(DISTINCT r.id) + 1) * 0.2)
        + (LOG(COUNT(DISTINCT o.id) + 1) * 0.3)
      ) as score

    FROM salons s

    LEFT JOIN reviews r ON r.salon_id = s.id
    LEFT JOIN orders o ON o.salon_id = s.id
  `;

  const values = [];

  // 🔥 FILTER CITY (SAFE)
  if (city) {
    query += ` WHERE s.city = $1`;
    values.push(city);
  }

  query += `
    GROUP BY s.id
    ORDER BY score DESC
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

module.exports = { createSalon, getSalons, getRankedSalons };