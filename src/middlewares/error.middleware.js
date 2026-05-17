const { ZodError } = require("zod");

const errorMiddleware = (err, req, res, next) => {

  // ZOD ERRORS
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errors: err.errors,
    });
  }

  // DEFAULT
  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorMiddleware;