module.exports = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" && err.stack) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
