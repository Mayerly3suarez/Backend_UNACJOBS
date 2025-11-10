const express = require("express");
const {
  createPostulacion,
  getPostulacionesByUser,
  getPostuladosByVacante,
  getPostulacionById,
  updatePostulacion,
  deletePostulacion,
} = require("../controllers/postulacionescontroller.js");
const auth = require("../middlewares/authMiddleware.js");
const checkRole = require("../middlewares/roleMiddleware.js");

const router = express.Router();

/**
 * 💼 RUTAS DE POSTULACIONES
 * La mayoría requieren autenticación con token JWT.
 */

// ✅ Crear nueva postulación (usuario autenticado)
router.post("/", auth, createPostulacion);

// ✅ Ver postulaciones del usuario autenticado
router.get("/", getPostulacionesByUser);

// postulados por vacante
router.get("/vacante/:vacanteId", getPostuladosByVacante);

// ✅ Ver detalle de una postulación específica
router.get("/:id", auth, getPostulacionById);

// ✅ Actualizar estado de una postulación (solo admin/coordinador)
router.put("/:id", auth, checkRole(["admin", "coordinador"]), updatePostulacion);

// ✅ Eliminar una postulación (usuario o admin)
router.delete("/:id", auth, deletePostulacion);

module.exports = router;
