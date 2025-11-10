const jwt = require("jsonwebtoken");
require("dotenv").config();

function resolveUserId(decoded) {
  if (!decoded || typeof decoded !== "object") return null;
  return (
    decoded.identificacion ||
    decoded.id ||
    decoded.userId ||
    decoded.sub ||
    (decoded.user && (decoded.user.identificacion || decoded.user.id)) ||
    (decoded.data && (decoded.data.identificacion || decoded.data.id || (decoded.data.user && decoded.data.user.id))) ||
    null
  );
}

module.exports = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header && header.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const identificacion = resolveUserId(decoded);
    req.user = { ...decoded, identificacion };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
