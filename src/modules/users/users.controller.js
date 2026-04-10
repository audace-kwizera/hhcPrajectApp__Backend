const service = require("./users.service");

const getUsers = async (req, res) => {
  const users = await service.getAllUsers();
  res.json(users);
};

module.exports = { getUsers };