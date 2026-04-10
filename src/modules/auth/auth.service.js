const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../utils/hash");

const register = async (data) => {
  const { email, password, role } = data;

  const hashed = await hashPassword(password);

  const result = await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1,$2,$3) RETURNING *",
    [email, hashed, role || "CLIENT"]
  );

  return result.rows[0];
};

const login = async (data) => {
  const { email, password } = data;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const valid = await comparePassword(password, user.password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

module.exports = { register, login };