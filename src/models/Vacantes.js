// models/vacanteModel.js
// 🔹 Modelo lógico para la tabla "Vacantes" en Supabase

const vacanteModel = {
  table: "vacantes",
  fields: {
    id: "id",
    titulo: "titulo",
    descripcion: "descripcion",
    facultad: "facultad",
    fecha_inicio: "fecha_inicio",
    fecha_fin: "fecha_fin",
  },
};

module.exports = { vacanteModel };
