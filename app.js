const express = require("express");
const cors = require("cors");
const documentRoutes = require("./src/routes/documentRoutes");
const userRoutes = require("./src/routes/userRoutes");
const alertRoutes = require("./src/routes/alertRoutes");
const contractRoutes = require("./src/routes/contractRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/documents", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Servidor UNACJOBS_BACK funcionando");
});

// Manejo centralizado de errores
app.use(errorHandler);

module.exports = app;
