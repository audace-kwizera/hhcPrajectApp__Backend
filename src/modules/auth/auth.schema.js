const { z } = require("zod");

const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),

  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .optional(),

  role: z
    .enum([
      "USER",
      "ADMIN",
      "EMPLOYEE",
      "PARTNER",
      "SALON",
    ])
    .optional(),
});

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = {
  registerSchema,
  loginSchema,
};