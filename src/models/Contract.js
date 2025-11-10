// models/contractModel.js
// 🔹 Modelo lógico para la tabla "contratos" en Supabase

const ContractModel = {
  table: "contratos",
  fields: {
    id: "id",
    tipo: "tipo",
    fechaInicio: "fechainicio",
    fechaFin: "fechafin",
    activo: "activo",
    userId: "userid",
  },
};

module.exports = { ContractModel };
