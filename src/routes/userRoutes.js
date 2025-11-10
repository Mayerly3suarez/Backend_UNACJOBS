const express = require("express");
const router = express.Router();
const {
  register,
  login,
  me,
} = require("../controllers/usercontroller.js");
const auth = require("../middlewares/authMiddleware.js");

// 🧾 Registro de usuario
router.post("/register", register);

// 🔐 Inicio de sesión
router.post("/login", login);

// 👤 Obtener datos del usuario autenticado
router.get("/me", auth, me);

module.exports = router;
