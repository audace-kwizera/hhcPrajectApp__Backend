const getSalonDashboard = async (req, res) => {
  try {
    const data = await service.getSalonDashboard(req.tenant);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};