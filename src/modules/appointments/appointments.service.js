// const pool = require("../../config/db");

// const createAppointment = async (data) => {
//   const {
//     client_id,
//     salon_id,
//     employee_id,
//     service,
//     price,
//     start_time,
//     end_time
//   } = data;

//   // 🔥 VALIDATION
//   if (!client_id || !salon_id || !service || !start_time) {
//     throw new Error("Missing required fields");
//   }

//   // 🔥 CHECK CLIENT EXISTS
//   const client = await pool.query(
//     "SELECT id FROM users WHERE id=$1",
//     [client_id]
//   );

//   if (client.rows.length === 0) {
//     throw new Error("Client does not exist");
//   }

//   // 🔥 CHECK SALON EXISTS
//   const salon = await pool.query(
//     "SELECT id FROM salons WHERE id=$1",
//     [salon_id]
//   );

//   if (salon.rows.length === 0) {
//     throw new Error("Salon does not exist");
//   }

//   const result = await pool.query(
//     `INSERT INTO appointments 
//     (client_id, salon_id, employee_id, service, price, start_time, end_time, status)
//     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
//     RETURNING *`,
//     [
//       client_id,
//       salon_id,
//       employee_id || null,
//       service,
//       price || 0,
//       start_time,
//       end_time || null,
//       "PENDING"
//     ]
//   );

//   return result.rows[0];
// };

// const getAppointments = async () => {
//   const result = await pool.query("SELECT * FROM appointments");
//   return result.rows;
// };

// module.exports = { createAppointment, getAppointments };

const pool = require("../../config/db");
const loyaltyService = require("../loyalty/loyalty.service");

const createAppointment = async (data) => {
  const {
    client_id,
    salon_id,
    employee_id,
    service,
    price,
    start_time,
    end_time
  } = data;

  // 🔥 VALIDATION
  if (!client_id || !salon_id || !service || !start_time) {
    throw new Error("Missing required fields");
  }

  // 🔥 FORCE PRICE NUMBER
  const priceNumber = Number(price) || 0;

  // 🔥 CHECK CLIENT EXISTS
  const client = await pool.query(
    "SELECT id FROM users WHERE id=$1",
    [client_id]
  );

  if (client.rows.length === 0) {
    throw new Error("Client does not exist");
  }

  // 🔥 CHECK SALON EXISTS
  const salon = await pool.query(
    "SELECT id FROM salons WHERE id=$1",
    [salon_id]
  );

  if (salon.rows.length === 0) {
    throw new Error("Salon does not exist");
  }

  // 🔥 CREATE APPOINTMENT
  const result = await pool.query(
    `INSERT INTO appointments 
    (client_id, salon_id, employee_id, service, price, start_time, end_time, status)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *`,
    [
      client_id,
      salon_id,
      employee_id || null,
      service,
      priceNumber,
      start_time,
      end_time || null,
      "PENDING"
    ]
  );

  const appointment = result.rows[0];

  // 🔥 BUSINESS LOGIC → LOYALTY
  try {
    await loyaltyService.addPoints(client_id, 10);
  } catch (err) {
    console.error("Loyalty error:", err.message);
  }

  return appointment;
};

const getAppointments = async () => {
  const result = await pool.query("SELECT * FROM appointments");
  return result.rows;
};

module.exports = { createAppointment, getAppointments };