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

  const priceNumber = Number(price) || 0;

  // 🔥 CHECK CLIENT
  const client = await pool.query(
    "SELECT id FROM users WHERE id=$1",
    [client_id]
  );

  if (client.rows.length === 0) {
    throw new Error("Client does not exist");
  }

  // 🔥 CHECK SALON
  const salon = await pool.query(
    "SELECT id FROM salons WHERE id=$1",
    [salon_id]
  );

  if (salon.rows.length === 0) {
    throw new Error("Salon does not exist");
  }

  // 🔥 CREATE RDV (NO LOYALTY HERE ❗)
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

  return result.rows[0];
};

const getAppointments = async () => {
  const result = await pool.query("SELECT * FROM appointments");
  return result.rows;
};

const updateStatus = async (id, status) => {

  const validStatus = ["PENDING", "CONFIRMED", "DONE", "CANCELLED"];

  if (!validStatus.includes(status)) {
    throw new Error("Invalid status");
  }

  const result = await pool.query(
    `UPDATE appointments
     SET status=$1
     WHERE id=$2
     RETURNING *`,
    [status, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Appointment not found");
  }

  const appointment = result.rows[0];

  // 🔥 LOYALTY ONLY IF DONE
  if (status === "DONE") {
    try {
      await loyaltyService.addPoints(appointment.client_id, 20);
    } catch (err) {
      console.error("Loyalty error:", err.message);
    }
  }

  return appointment;
};

module.exports = {
  createAppointment,
  getAppointments,
  updateStatus
};