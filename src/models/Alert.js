// models/alertModel.js
// 🔹 Modelo lógico para la tabla "alertas" en Supabase

const AlertModel = {
  table: "alertas",
  fields: {
    id: "id",
    mensaje: "mensaje",
    leido: "leido",
    fechaAlerta: "fechaalerta",
    userId: "userid",
  },
};

module.exports = { AlertModel };
