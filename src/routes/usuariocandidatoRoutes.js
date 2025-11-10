const express = require("express");
const {
  createCandidato,
  getPerfilCandidato,
  updateCandidato,
  deleteCandidato,
} = require("../controllers/usuariocandidatocontroller.js");
const auth = require("../middlewares/authMiddleware.js");

const router = express.Router();

/**
 * 👤 RUTAS DE PERFIL DE CANDIDATO
 * Todas requieren autenticación (token JWT válido)
 */

// ✅ Crear perfil de candidato
router.post("/", auth, createCandidato);

// ✅ Obtener perfil del candidato autenticado
router.get("/", auth, getPerfilCandidato);

// ✅ Actualizar datos del perfil
router.put("/", auth, updateCandidato);

// ✅ Eliminar perfil de candidato
router.delete("/", auth, deleteCandidato);

module.exports = router;
