// src/models/Postulaciones.js
// Modelo para la tabla "postulaciones" en Supabase

const PostulacionModel = {
  table: "postulaciones",
  fields: {
    id: "id",
    candidato: "candidato",
    vacante: "vacante",
    informacion: "informacion", // 👈 nuevo campo agregado
    fecha_postulacion: "fecha_postulacion",
    estado: "estado",
  },
};

module.exports = { PostulacionModel };
