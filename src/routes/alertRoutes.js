const express = require("express");
const { getAlertsByUser, markAsRead } = require("../controllers/alertController.js");
const auth = require("../middlewares/authMiddleware.js");

const router = express.Router();

/**
 * 📢 RUTAS DE ALERTAS
 * Todas requieren autenticación (token válido)
 */

// ✅ Obtener alertas del usuario autenticado
// Ejemplo: GET /api/alertas
router.get("/", auth, getAlertsByUser);

// ✅ Marcar una alerta como leída
// Ejemplo: PUT /api/alertas/:id/read
router.put("/:id/read", auth, markAsRead);

module.exports = router;
