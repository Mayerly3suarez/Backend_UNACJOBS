const express = require("express");
const {
  createContract,
  getContracts,
  updateContract,
  deleteContract
} = require("../controllers/contractController.js");
const auth = require("../middlewares/authMiddleware.js");
const role = require("../middlewares/roleMiddleware.js");

const router = express.Router();

// 📝 Crear contrato (admin puede crear para cualquier userId, docente solo para sí mismo)
router.post("/", auth, createContract);

// 📋 Listar contratos
router.get("/", auth, getContracts);

// ✏️ Actualizar contrato
router.put("/:id", auth, updateContract);

// ❌ Eliminar contrato
router.delete("/:id", auth, deleteContract);

module.exports = router;
