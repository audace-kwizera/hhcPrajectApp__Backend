const pool = require("../../config/db");

const createReview = async (data) => {
  const { user_id, salon_id, appointment_id, rating, comment } = data;

  if (!user_id || !salon_id || !rating) {
    throw new Error("Missing required fields");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  // 🔥 CHECK APPOINTMENT (sécurité)
  if (appointment_id) {
  const appointment = await pool.query(
    "SELECT * FROM appointments WHERE id=$1 AND client_id=$2 AND status='DONE'",
    [appointment_id, user_id]
  );

  if (appointment.rows.length === 0) {
    throw new Error("Appointment not completed");
  }
}

  const result = await pool.query(
    `INSERT INTO reviews 
    (user_id, salon_id, appointment_id, rating, comment)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *`,
    [user_id, salon_id, appointment_id || null, rating, comment]
  );

  return result.rows[0];
};

// 🔥 GET REVIEWS BY SALON
const getSalonReviews = async (salon_id) => {
  const result = await pool.query(
    `SELECT r.*, u.email
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE salon_id = $1
     ORDER BY created_at DESC`,
    [salon_id]
  );

  return result.rows;
};

// 🔥 AVG RATING
const getSalonRating = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
      AVG(rating)::numeric(2,1) as avg_rating,
      COUNT(*) as total_reviews
     FROM reviews
     WHERE salon_id=$1`,
    [salon_id]
  );

  return result.rows[0];
};

module.exports = {
  createReview,
  getSalonReviews,
  getSalonRating
};