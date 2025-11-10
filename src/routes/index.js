const express = require("express");
const router = express.Router();

// Importar subrutas
const documentRoutes = require("./documentRoutes");

router.use("/documents", documentRoutes);

module.exports = router;
