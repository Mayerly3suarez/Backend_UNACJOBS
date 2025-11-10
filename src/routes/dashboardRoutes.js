const express = require("express");
const auth = require("../middlewares/authMiddleware.js");
const { getStats } = require("../controllers/dashboardController.js");

const router = express.Router();

router.get("/stats", auth, getStats);

module.exports = router;
