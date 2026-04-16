module.exports = (req, res, next) => {
  // 🔥 ADMIN = accès global
  if (req.user.role === "ADMIN") {
    req.tenant = { salon_id: null, isAdmin: true };
    return next();
  }

  // 🔥 autres users = obligatoirement liés à un salon
  if (!req.user.salon_id) {
    return res.status(403).json({ error: "No salon assigned" });
  }

  req.tenant = {
    salon_id: req.user.salon_id,
    isAdmin: false
  };

  next();
};