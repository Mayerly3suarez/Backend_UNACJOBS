module.exports = (roles = []) => {
  // roles puede ser 'admin' o ['admin']
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ error: "Acceso denegado" });
    next();
  };
};
