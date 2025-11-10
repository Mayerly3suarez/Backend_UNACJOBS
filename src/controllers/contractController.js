const { supabase } = require("../config/db.js");

// 📝 Crear contrato
exports.createContract = async (req, res, next) => {
  try {
    const { tipo, fechaInicio, fechaFin, userId } = req.body;

    if (!tipo || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos obligatorios",
      });
    }

    // Si no se pasa userId, se usa el del usuario autenticado
    const usuarioId = userId || req.user.identificacion;

    const { data, error } = await supabase
      .from("contratos")
      .insert([
        {
          tipo,
          fechainicio: fechaInicio,
          fechafin: fechaFin,
          usuario: usuarioId, // 👈 referencia al campo correcto en tu BD
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Contrato creado correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// 📄 Obtener contratos (de todos o de un usuario)
exports.getContracts = async (req, res, next) => {
  try {
    const { userId } = req.query;

    let query = supabase.from("contratos").select("*");

    if (userId) query = query.eq("usuario", userId); // 👈 campo correcto

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Contratos obtenidos correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ✏️ Actualizar contrato
exports.updateContract = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar existencia
    const { data: existing, error: fetchError } = await supabase
      .from("contratos")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Contrato no encontrado",
      });
    }

    // Actualizar contrato
    const { data, error } = await supabase
      .from("contratos")
      .update(req.body)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Contrato actualizado correctamente",
      data,
    });
  } catch (err) {
    next(err);
  }
};

// ❌ Eliminar contrato
exports.deleteContract = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar existencia
    const { data: existing, error: fetchError } = await supabase
      .from("contratos")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Contrato no encontrado",
      });
    }

    // Eliminar contrato
    const { error } = await supabase.from("contratos").delete().eq("id", id);
    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Contrato eliminado correctamente",
    });
  } catch (err) {
    next(err);
  }
};
