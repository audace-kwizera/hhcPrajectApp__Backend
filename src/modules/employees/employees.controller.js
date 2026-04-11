const service = require("./employees.service");

const createEmployee = async (req, res) => {
  try {
    const employee = await service.createEmployee(req.body);
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getEmployees = async (req, res) => {
  const employees = await service.getEmployees();
  res.json(employees);
};

module.exports = { createEmployee, getEmployees };