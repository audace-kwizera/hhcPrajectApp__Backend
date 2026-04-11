const pool = require("../../config/db");

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

  const result = await pool.query(
    `INSERT INTO appointments 
    (client_id,salon_id,employee_id,service,price,start_time,end_time)
    VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [client_id, salon_id, employee_id, service, price, start_time, end_time]
  );

  return result.rows[0];
};

const getAppointments = async () => {
  const result = await pool.query("SELECT * FROM appointments");
  return result.rows;
};

module.exports = { createAppointment, getAppointments };