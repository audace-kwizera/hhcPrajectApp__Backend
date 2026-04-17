// const pool = require("../../config/db");

// const createReview = async (data) => {
//   const { user_id, salon_id, appointment_id, rating, comment } = data;

//   if (!user_id || !salon_id || !rating) {
//     throw new Error("Missing required fields");
//   }

//   if (rating < 1 || rating > 5) {
//     throw new Error("Invalid rating");
//   }

//   // 🔥 CHECK APPOINTMENT (sécurité)
//   if (appointment_id) {
//   const appointment = await pool.query(
//     "SELECT * FROM appointments WHERE id=$1 AND client_id=$2 AND status='DONE'",
//     [appointment_id, user_id]
//   );

//   if (appointment.rows.length === 0) {
//     throw new Error("Appointment not completed");
//   }
// }

//   const result = await pool.query(
//     `INSERT INTO reviews 
//     (user_id, salon_id, appointment_id, rating, comment)
//     VALUES ($1,$2,$3,$4,$5)
//     RETURNING *`,
//     [user_id, salon_id, appointment_id || null, rating, comment]
//   );

//   return result.rows[0];
// };

// // 🔥 GET REVIEWS BY SALON
// const getSalonReviews = async (salon_id) => {
//   const result = await pool.query(
//     `SELECT r.*, u.email
//      FROM reviews r
//      JOIN users u ON u.id = r.user_id
//      WHERE salon_id = $1
//      ORDER BY created_at DESC`,
//     [salon_id]
//   );

//   return result.rows;
// };

// // 🔥 AVG RATING
// const getSalonRating = async (salon_id) => {
//   const result = await pool.query(
//     `SELECT 
//       AVG(rating)::numeric(2,1) as avg_rating,
//       COUNT(*) as total_reviews
//      FROM reviews
//      WHERE salon_id=$1`,
//     [salon_id]
//   );

//   return result.rows[0];
// };

// // 🔥 ADD REPLY
// const addReply = async (data) => {
//   const { review_id, salon_id, reply } = data;

//   if (!review_id || !salon_id || !reply) {
//     throw new Error("Missing fields");
//   }

//   // 🔥 CHECK REVIEW
//   const review = await pool.query(
//     "SELECT * FROM reviews WHERE id=$1",
//     [review_id]
//   );

//   if (review.rows.length === 0) {
//     throw new Error("Review not found");
//   }

//   // 🔥 CHECK SALON MATCH
//   if (review.rows[0].salon_id !== salon_id) {
//     throw new Error("Unauthorized");
//   }

//   const result = await pool.query(
//     `INSERT INTO review_replies (review_id, salon_id, reply)
//      VALUES ($1,$2,$3)
//      RETURNING *`,
//     [review_id, salon_id, reply]
//   );

//   return result.rows[0];
// };

// // 🔥 GET REVIEWS WITH REPLIES
// const getSalonReviewsWithReplies = async (salon_id) => {
//   const result = await pool.query(
//     `SELECT 
//       r.*,
//       u.email,
//       rr.reply,
//       rr.created_at AS reply_created_at

//      FROM reviews r

//      JOIN users u ON u.id = r.user_id

//      LEFT JOIN review_replies rr 
//      ON rr.review_id = r.id

//      WHERE r.salon_id = $1

//      ORDER BY r.created_at DESC`,
//     [salon_id]
//   );

//   return result.rows;
// };

// // 🔥 FLAG REVIEW
// const flagReview = async (review_id) => {
//   const result = await pool.query(
//     `UPDATE reviews 
//      SET is_flagged = true
//      WHERE id = $1
//      RETURNING *`,
//     [review_id]
//   );

//   return result.rows[0];
// };

// // 🔥 ADMIN → GET FLAGGED
// const getFlaggedReviews = async () => {
//   const result = await pool.query(
//     `SELECT 
//       r.*,
//       u.email,
//       s.name as salon_name
//      FROM reviews r
//      JOIN users u ON u.id = r.user_id
//      JOIN salons s ON s.id = r.salon_id
//      WHERE r.is_flagged = true
//      ORDER BY r.created_at DESC`
//   );

//   return result.rows;
// };

// // 🔥 ADMIN → HIDE
// const hideReview = async (review_id) => {
//   const result = await pool.query(
//     `UPDATE reviews 
//      SET status = 'HIDDEN'
//      WHERE id = $1
//      RETURNING *`,
//     [review_id]
//   );

//   return result.rows[0];
// };

// // 🔥 ADMIN → RESTORE
// const restoreReview = async (review_id) => {
//   const result = await pool.query(
//     `UPDATE reviews 
//      SET status = 'VISIBLE',
//          is_flagged = false
//      WHERE id = $1
//      RETURNING *`,
//     [review_id]
//   );

//   return result.rows[0];
// };

// module.exports = {
//   createReview,
//   getSalonReviews,
//   getSalonRating,
//   addReply,
//   getSalonReviewsWithReplies,
//   flagReview,
//   getFlaggedReviews,
//   hideReview,
//   restoreReview
// };

const pool = require("../../config/db");


// ======================================
// 🔥 CREATE REVIEW (SECURE)
// ======================================
const createReview = async (data, user) => {
  const { salon_id, appointment_id, rating, comment } = data;

  const user_id = user.id; // 🔐 sécurisé depuis JWT

  if (!user_id || !salon_id || !rating) {
    throw new Error("Missing required fields");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Invalid rating");
  }

  // 🔐 CHECK APPOINTMENT + SALON MATCH
  if (appointment_id) {
    const appointment = await pool.query(
      `SELECT * FROM appointments 
       WHERE id=$1 
       AND client_id=$2 
       AND salon_id=$3
       AND status='DONE'`,
      [appointment_id, user_id, salon_id]
    );

    if (appointment.rows.length === 0) {
      throw new Error("Invalid appointment for this salon");
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


// ======================================
// 🔥 GET REVIEWS (PUBLIC)
// ======================================
const getSalonReviews = async (salon_id) => {
  const result = await pool.query(
    `SELECT r.*, u.email
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.salon_id = $1
     AND r.status != 'HIDDEN'
     ORDER BY r.created_at DESC`,
    [salon_id]
  );

  return result.rows;
};


// ======================================
// 🔥 RATING
// ======================================
const getSalonRating = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
      AVG(rating)::numeric(2,1) as avg_rating,
      COUNT(*) as total_reviews
     FROM reviews
     WHERE salon_id=$1
     AND status != 'HIDDEN'`,
    [salon_id]
  );

  return result.rows[0];
};


// ======================================
// 🔥 ADD REPLY (SECURE MULTI-TENANT)
// ======================================
const addReply = async (data, tenant) => {
  const { review_id, reply } = data;

  const salon_id = tenant.salon_id; // 🔐 sécurisé

  if (!review_id || !reply) {
    throw new Error("Missing fields");
  }

  // 🔐 CHECK REVIEW
  const review = await pool.query(
    "SELECT * FROM reviews WHERE id=$1",
    [review_id]
  );

  if (review.rows.length === 0) {
    throw new Error("Review not found");
  }

  // 🔐 MULTI-TENANT SECURITY
  if (!tenant.isAdmin && review.rows[0].salon_id !== salon_id) {
    throw new Error("Unauthorized");
  }

  const result = await pool.query(
    `INSERT INTO review_replies (review_id, salon_id, reply)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [review_id, salon_id, reply]
  );

  return result.rows[0];
};


// ======================================
// 🔥 GET REVIEWS WITH REPLIES
// ======================================
const getSalonReviewsWithReplies = async (salon_id) => {
  const result = await pool.query(
    `SELECT 
      r.*,
      u.email,
      rr.reply,
      rr.created_at AS reply_created_at

     FROM reviews r
     JOIN users u ON u.id = r.user_id

     LEFT JOIN review_replies rr 
     ON rr.review_id = r.id

     WHERE r.salon_id = $1
     AND r.status != 'HIDDEN'

     ORDER BY r.created_at DESC`,
    [salon_id]
  );

  return result.rows;
};


// ======================================
// 🔥 FLAG REVIEW (USER)
// ======================================
const flagReview = async (review_id) => {
  const result = await pool.query(
    `UPDATE reviews 
     SET is_flagged = true
     WHERE id = $1
     RETURNING *`,
    [review_id]
  );

  return result.rows[0];
};


// ======================================
// 🔥 ADMIN MODERATION
// ======================================
const getFlaggedReviews = async () => {
  const result = await pool.query(
    `SELECT 
      r.*,
      u.email,
      s.name as salon_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN salons s ON s.id = r.salon_id
     WHERE r.is_flagged = true
     ORDER BY r.created_at DESC`
  );

  return result.rows;
};


const hideReview = async (review_id) => {
  const result = await pool.query(
    `UPDATE reviews 
     SET status = 'HIDDEN'
     WHERE id = $1
     RETURNING *`,
    [review_id]
  );

  return result.rows[0];
};


const restoreReview = async (review_id) => {
  const result = await pool.query(
    `UPDATE reviews 
     SET status = 'VISIBLE',
         is_flagged = false
     WHERE id = $1
     RETURNING *`,
    [review_id]
  );

  return result.rows[0];
};


module.exports = {
  createReview,
  getSalonReviews,
  getSalonRating,
  addReply,
  getSalonReviewsWithReplies,
  flagReview,
  getFlaggedReviews,
  hideReview,
  restoreReview
};