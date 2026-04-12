const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

/// Application 
const app = express();

/// Client
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/users.routes");

/// Appointment & Salons & Fidelity
const salonRoutes = require("./modules/salons/salons.routes");
const appointmentRoutes = require("./modules/appointments/appointments.routes");
const loyaltyRoutes = require("./modules/loyalty/loyalty.routes");

/// Employees
const employeeRoutes = require("./modules/employees/employees.routes");

/// Orders
const orderRoutes = require("./modules/orders/orders.routes");

/// Inventory & Stock
const inventoryRoutes = require("./modules/inventory/inventory.routes");
const transferRoutes = require("./modules/transfers/transfers.routes");

/// Dashboard
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");

/// Client
const selfieRoutes = require("./modules/selfie/selfie.routes");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

/// Salons & Appointment & Fidelity
app.use("/api/salons", salonRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/loyalty", loyaltyRoutes);

/// Employees
app.use("/api/employees", employeeRoutes);

/// Orders
app.use("/api/orders", orderRoutes);

/// Inventory & Stock
app.use("/api/inventory", inventoryRoutes);
app.use("/api/transfers", transferRoutes);

/// Dashboard
app.use("/api/dashboard", dashboardRoutes);

/// Client
app.use("/api/selfie", selfieRoutes);

app.get("/", (req, res) => {
  res.send("HHC API 🚀");
});

module.exports = app;