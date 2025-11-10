const { supabase } = require("../config/db.js");

// 🧩 Crear una nueva vacante
exports.createVacante = async (req, res, next) => {
  try {
    const { titulo, descripcion, facultad, fecha_inicio, fecha_fin } = req.body;

    // Validación básica
    if (!titulo || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: título y fecha de inicio",
      });
    }

    const { data, error } = await supabase
      .from("vacantes")
      .insert([{ titulo, descripcion, facultad, fecha_inicio, fecha_fin }])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Vacante creada correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 📋 Obtener todas las vacantes
exports.getVacantes = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("vacantes")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Lista de vacantes obtenida correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 🔍 Obtener una vacante por ID
exports.getVacanteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("vacantes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Vacante no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vacante obtenida correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Actualizar una vacante
exports.updateVacante = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, facultad, fecha_inicio, fecha_fin } = req.body;

    const { data, error } = await supabase
      .from("vacantes")
      .update({ titulo, descripcion, facultad, fecha_inicio, fecha_fin })
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "No se pudo actualizar la vacante (posiblemente no existe)",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vacante actualizada correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Eliminar una vacante
exports.deleteVacante = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("vacantes").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Vacante eliminada correctamente",
    });
  } catch (err) {
    next(err);
  }
};
