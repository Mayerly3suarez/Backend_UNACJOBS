// src/models/UsuarioCandidato.js
// Modelo para la tabla Usuario_Candidato en Supabase

const UsuarioCandidatoModel = {
  table: "Usuario_Candidato",
  fields: {
    usuario: "usuario",
    edad: "edad",
    direccion: "direccion",
    facultad: "facultad",
    fecha: "fecha",
  },
};

module.exports = { UsuarioCandidatoModel };
