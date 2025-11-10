const { supabase } = require("../config/db.js");
const { PostulacionModel } = require("../models/postulaciones.js");

// 🧩 Crear una nueva postulación
exports.createPostulacion = async (req, res, next) => {
  try {
    const { vacante, informacion } = req.body;

    if (!vacante) {
      return res.status(400).json({
        success: false,
        message: "El ID de la vacante es obligatorio",
      });
    }

    // 👇 Intentamos obtener el correo desde el token o desde el body
    const correo =
      req.user?.email ||
      informacion?.correo ||
      informacion?.email;

    if (!correo) {
      return res.status(400).json({
        success: false,
        message: "No se pudo obtener el correo del usuario autenticado",
      });
    }

    // 🧠 Buscar el ID real del usuario en la tabla "usuarios"
    const { data: userData, error: userError } = await supabase
      .from("usuario")
      .select("identificacion")
      .eq("email", correo)
      .maybeSingle();

    if (userError || !userData) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el usuario en la base de datos",
      });
    }

    const candidatoId = userData.identificacion;
    const vacanteId = Number(vacante);

    // 🕵️ Verificar si ya existe postulación del mismo candidato
    const { data: existing, error: existErr } = await supabase
      .from(PostulacionModel.table)
      .select("*")
      .eq("candidato", candidatoId)
      .eq("vacante", vacanteId)
      .maybeSingle();

    if (existErr) throw existErr;
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Ya te has postulado a esta vacante",
      });
    }

    // 📝 Crear nueva postulación
    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .insert([
        {
          candidato: candidatoId,
          vacante: vacanteId,
          informacion,
          fecha_postulacion: new Date().toISOString(),
          estado: "En revisión",
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Postulación creada correctamente",
      data,
    });
  } catch (err) {
    console.error("❌ Error al crear postulación:", err);
    next(err);
  }
};


// 📋 Obtener todas las postulaciones del usuario autenticado
exports.getPostulacionesByUser = async (req, res, next) => {
  try {
    const { email } = req.query; // 👈 viene del front

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "El correo del usuario es obligatorio",
      });
    }

    // 🔍 Buscar el usuario por correo
    const { data: userData, error: userError } = await supabase
      .from("usuario")
      .select("identificacion")
      .eq("email", email)
      .maybeSingle();

    if (userError || !userData) {
      return res.status(404).json({
        success: false,
        message: "No se encontró el usuario en la base de datos",
      });
    }

    const candidato = userData.identificacion;

    // 📋 Obtener postulaciones del candidato
    const { data, error } = await supabase
      .from(PostulacionModel.table)
      .select(`id, vacante:vacante(*), fecha_postulacion, estado`)
      .eq("candidato", candidato)
      .order("fecha_postulacion", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: "Postulaciones obtenidas correctamente",
      data,
    });
  } catch (err) {
    console.error("❌ Error al obtener postulaciones:", err);
    next(err);
  }
};

// Obtener los postulados de una vacante
exports.getPostuladosByVacante = async (req, res, next) => {
  try {
    const { vacanteId } = req.params;

    const { data, error } = await supabase
      .from("postulaciones")
      .select("informacion")
      .eq("vacante", vacanteId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hay postulados para esta vacante",
      });
    }

    // información está guardada como JSON en la DB
    const postulados = data.map((p) => JSON.parse(p.informacion));

    res.status(200).json({
      success: true,
      message: "Postulados obtenidos correctamente",
      data: postulados,
    });
  } catch (err) {
    console.error("❌ Error al obtener postulados:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener los postulados",
    });
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
