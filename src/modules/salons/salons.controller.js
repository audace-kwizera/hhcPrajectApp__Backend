const service = require("./salons.service");

const createSalon = async (req, res) => {
  try {
    const salon = await service.createSalon(req.body);
    res.json(salon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getSalons = async (req, res) => {
  const salons = await service.getSalons();
  res.json(salons);
};

module.exports = { createSalon, getSalons };