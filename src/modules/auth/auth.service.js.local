const pool = require("../../config/db");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../../utils/hash");

const register = async (data) => {
  const { email, password, role, firstName, lastName } = data;

  // 🔥 VALIDATION
  // if (!email || !password || !firstName) {
  //   throw new Error("Missing required fields");
  // }

  // 🔥 EMAIL UNIQUE
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("Email already used");
  }

  // 🔥 ROLE SECURE (RBAC SAFE)
  const allowedRoles = ["USER", "ADMIN", "EMPLOYEE", "PARTNER", "SALON"];

  const safeRole = allowedRoles.includes(role) ? role : "USER";

  // 🔥 HASH PASSWORD
  const hashed = await hashPassword(password);

  // 🔥 INSERT
  const result = await pool.query(
    `INSERT INTO users (email, password, role, "firstName", "lastName")
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id, email, role, "firstName", "lastName"`,
    [
      email,
      hashed,
      safeRole, 
      firstName,
      lastName || null
    ]
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
    { id: user.id, role: user.role, salon_id: user.salon_id || null },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
};

module.exports = { register, login };