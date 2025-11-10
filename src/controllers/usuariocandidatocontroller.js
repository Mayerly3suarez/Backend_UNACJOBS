const { supabase } = require("../config/db.js");
const { UsuarioCandidatoModel } = require("../models/UsuarioCandidato.js");

// 🧩 Crear perfil de candidato (solo una vez por usuario)
exports.createCandidato = async (req, res, next) => {
  try {
    const { edad, direccion, facultad, fecha } = req.body;
    const usuario = req.user.identificacion; // 👈 tomado del token JWT

    // Verificar si ya existe un perfil de candidato
    const { data: existing, error: existErr } = await supabase
      .from(UsuarioCandidatoModel.table)
      .select("*")
      .eq("usuario", usuario)
      .maybeSingle();

    if (existErr) throw existErr;
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya tiene un perfil de candidato registrado",
      });
    }

    // Crear nuevo registro de candidato
    const { data, error } = await supabase
      .from(UsuarioCandidatoModel.table)
      .insert([{ usuario, edad, direccion, facultad, fecha }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Perfil de candidato creado correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 📋 Obtener perfil del usuario autenticado
exports.getPerfilCandidato = async (req, res, next) => {
  try {
    const usuario = req.user.identificacion;

    const { data, error } = await supabase
      .from(UsuarioCandidatoModel.table)
      .select("*")
      .eq("usuario", usuario)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Perfil de candidato no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil de candidato obtenido correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Actualizar perfil del candidato
exports.updateCandidato = async (req, res, next) => {
  try {
    const usuario = req.user.identificacion;
    const { edad, direccion, facultad, fecha } = req.body;

    const { data, error } = await supabase
      .from(UsuarioCandidatoModel.table)
      .update({ edad, direccion, facultad, fecha })
      .eq("usuario", usuario)
      .select("*")
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "No se pudo actualizar el perfil del candidato",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil de candidato actualizado correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Eliminar perfil del candidato
exports.deleteCandidato = async (req, res, next) => {
  try {
    const usuario = req.user.identificacion;

    const { error } = await supabase
      .from(UsuarioCandidatoModel.table)
      .delete()
      .eq("usuario", usuario);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Perfil de candidato eliminado correctamente",
    });
  } catch (err) {
    next(err);
  }
};
