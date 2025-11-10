const express = require("express");
const {
  createVacante,
  getVacantes,
  getVacanteById,
  updateVacante,
  deleteVacante,
} = require("../controllers/vacantescontroller.js");
const auth = require("../middlewares/authMiddleware.js");

const router = express.Router();

/**
 * 🎯 RUTAS DE VACANTES
 * Todas las rutas requieren autenticación mediante token JWT.
 */

// ✅ Obtener todas las vacantes
// Ejemplo: GET /api/vacantes
router.get("/", auth, getVacantes);

// ✅ Obtener una vacante específica por ID
// Ejemplo: GET /api/vacantes/:id
router.get("/:id", auth, getVacanteById);

// ✅ Crear una nueva vacante (solo para roles administrativos si lo deseas)
// Ejemplo: POST /api/vacantes
router.post("/", auth, createVacante);

// ✅ Actualizar una vacante existente
// Ejemplo: PUT /api/vacantes/:id
router.put("/:id", auth, updateVacante);

// ✅ Eliminar una vacante
// Ejemplo: DELETE /api/vacantes/:id
router.delete("/:id", auth, deleteVacante);

module.exports = router;
