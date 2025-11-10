// models/userModel.js
// 🔹 Modelo lógico para la tabla de usuarios en Supabase

const UserModel = {
  // Ajusta el nombre a tu tabla real en Supabase. En este proyecto se usa "usuario".
  table: "usuario",

  fields: {
    id: "id",
    nombre: "nombre",
    apellido: "apellido",
    email: "email",
    password: "password",
    rol: "rol",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};

module.exports = { UserModel };
