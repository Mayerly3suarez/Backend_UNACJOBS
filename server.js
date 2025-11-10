require("dotenv").config();
console.log("🔑 JWT_SECRET =", process.env.JWT_SECRET);

const { testAllTables } = require("./src/config/db");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "0.0.0.0"; // Permite acceder desde otras máquinas en la red

// 🌍 Middlewares globales
app.use(
  cors({
    origin: "http://localhost:5173", // dominio del frontend Vite
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Rutas principales de la API
app.use("/api/users", require("./src/routes/userRoutes.js"));
app.use("/api/alertas", require("./src/routes/alertRoutes.js"));
app.use("/api/contratos", require("./src/routes/contractRoutes.js"));
app.use("/api/dashboard", require("./src/routes/dashboardRoutes.js"));
app.use("/api/documentos", require("./src/routes/documentRoutes.js"));
app.use("/api/vacantes", require("./src/routes/vacantesRoutes.js"));
app.use("/api/postulaciones", require("./src/routes/postulacionesRoutes.js"));
app.use("/api/candidato", require("./src/routes/usuariocandidatoRoutes.js"));

// 🏠 Ruta raíz para verificar el estado del servidor
app.get("/", (req, res) => {
  res.send("🚀 Bienvenido a la API de UNACJobs — el servidor está corriendo correctamente ✅");
});

// 🧪 Rutas de prueba de base de datos
app.get("/api/test-all-tables", async (req, res) => {
  const q = (req.query.tables || "").toString();
  const tables = q ? q.split(",").map(s => s.trim()).filter(Boolean) : undefined;
  const result = await testAllTables(tables);
  res.json(result);
});

app.get("/api/test-all-tables/all", async (_req, res) => {
  const result = await testAllTables();
  res.json(result);
});

// 🧱 Middleware global de errores
app.use(require("./src/middlewares/errorHandler.js"));

// 🚀 Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor corriendo en http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
});
