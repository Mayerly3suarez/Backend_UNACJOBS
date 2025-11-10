// models/documentModel.js
// 🔹 Modelo lógico para la tabla "documentos" en Supabase

const DocumentModel = {
  table: "documentos",
  fields: {
    id: "id",
    candidato: "candidato",
    nombre_documento: "nombre_documento",
    tipo: "tipo",
    url: "url",
    fecha_subida: "fecha_subida",
  },
};

module.exports = { DocumentModel };
