const express = require("express");
const {
  createDocument,
  getDocumentsByUser,
  deleteDocument,
  uploadToCloudinary,
} = require("../controllers/documentController.js");
const auth = require("../middlewares/authMiddleware.js");
const role = require("../middlewares/roleMiddleware.js");
const upload = require("../middlewares/uploadMiddleware.js");

const router = express.Router();

/**
 * 📂 RUTAS DE DOCUMENTOS
 * Todas requieren autenticación.
 * Algunas restringidas por rol (admin, docente, candidato).
 */

// 📄 Crear registro de documento (cuando ya existe una URL)
router.post("/", auth, createDocument);

// 📤 Subir archivo a Cloudinary y crear registro asociado al usuario autenticado
router.post("/upload", auth, upload.single("file"), uploadToCloudinary);

// 👀 Ver documentos del usuario autenticado (o todos si es admin)
router.get("/", auth, role(["admin", "docente", "candidato"]), getDocumentsByUser);

// 🗑️ Eliminar documento (solo admin)
router.delete("/:id", auth, role(["admin"]), deleteDocument);

module.exports = router;
