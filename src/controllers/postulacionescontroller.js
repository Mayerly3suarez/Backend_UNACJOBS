const { supabase } = require("../config/db.js");
const { PostulacionModel } = require("../models/postulaciones.js");

// 🧩 Crear una nueva postulación
exports.createPostulacion = async (req, res, next) => {
  try {
    const { vacante } = req.body;
    const candidato = req.user.identificacion; // 👈 asumimos que el JWT trae este campo

    if (!vacante) {
      return res.status(400).json({
        success: false,
        message: "El ID de la vacante es obligatorio",
      });
    }

    // Verificar si ya existe una postulación del mismo candidato a la misma vacante
    const { data: existing, error: existErr } = await supabase
      .from(PostulacionModel.table)
      .select("*")
      .eq("candidato", candidato)
      .eq("vacante", vacante)
      .maybeSingle();

    if (existErr) throw existErr;
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya te has postulado a esta vacante",
      });
    }

    // Crear nueva postulación
    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .insert([{ candidato, vacante }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Postulación creada correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 📋 Obtener todas las postulaciones del usuario autenticado
exports.getPostulacionesByUser = async (req, res, next) => {
  try {
    const candidato = req.user.identificacion;

    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .select(
        `id, vacante:vacante(*), fecha_postulacion, estado`
      )
      .eq("candidato", candidato)
      .order("fecha_postulacion", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Postulaciones del usuario obtenidas correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 Obtener una postulación específica
exports.getPostulacionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Postulación no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Postulación obtenida correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Actualizar el estado de una postulación (solo admin/coordinador)
exports.updatePostulacion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        message: "El campo 'estado' es obligatorio para actualizar",
      });
    }

    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .update({ estado })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "No se pudo actualizar la postulación",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estado de postulación actualizado correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Eliminar una postulación (por el propio usuario o admin)
exports.deletePostulacion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from(PostulacionModel.table)
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Postulación eliminada correctamente",
    });
  } catch (err) {
    next(err);
  }
};
