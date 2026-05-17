const authService = require("./auth.service");

const {
  registerSchema,
  loginSchema,
} = require("./auth.schema");

const register = async (req, res, next) => {
  try {
    const validatedData =
      registerSchema.parse(req.body);

    const user =
      await authService.register(validatedData);

    res.json(user);

  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const validatedData =
      loginSchema.parse(req.body);

    const data =
      await authService.login(validatedData);

    res.json(data);

  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
};