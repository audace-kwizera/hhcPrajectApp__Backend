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

const getRankedSalons = async (req, res) => {
  try {
    const { city } = req.query;

    const salons = await service.getRankedSalons(city);

    res.json(salons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createSalon, getSalons, getRankedSalons };