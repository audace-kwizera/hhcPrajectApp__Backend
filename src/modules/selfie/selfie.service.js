const pool = require("../../config/db");
const loyaltyService = require("../loyalty/loyalty.service");

// 🔥 CREATE SELFIE
const createSelfie = async ({ user_id, salon_id, image_url }) => {
  if (!user_id || !salon_id || !image_url) {
    throw new Error("Missing fields");
  }

  const result = await pool.query(
    `INSERT INTO selfie_care (user_id, salon_id, image_url)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [user_id, salon_id, image_url]
  );

  return result.rows[0];
};

// 🔥 VALIDATE SELFIE (SALON)
const validateSelfie = async (id) => {
  const result = await pool.query(
    `UPDATE selfie_care
     SET status='SALON_VALIDATED'
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

// 🔥 APPROVE SELFIE (ADMIN)
const approveSelfie = async (id) => {
  const result = await pool.query(
    `UPDATE selfie_care
     SET status='APPROVED'
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  const selfie = result.rows[0];

  // 🔥 REWARD (LOYALTY)
  if (selfie && !selfie.reward_applied) {
    await loyaltyService.addPoints(selfie.user_id, 20);

    await pool.query(
      `UPDATE selfie_care
       SET reward_applied = true
       WHERE id=$1`,
      [id]
    );
  }

  return selfie;
};

// 🔥 REJECT SELFIE
const rejectSelfie = async (id) => {
  const result = await pool.query(
    `UPDATE selfie_care
     SET status='REJECTED'
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  return result.rows[0];
};

// 🔥 GET ALL SELFIES
const getSelfies = async () => {
  const result = await pool.query(
    `SELECT * FROM selfie_care ORDER BY created_at DESC`
  );

  return result.rows;
};

module.exports = {
  createSelfie,
  validateSelfie,
  approveSelfie,
  rejectSelfie,
  getSelfies
};