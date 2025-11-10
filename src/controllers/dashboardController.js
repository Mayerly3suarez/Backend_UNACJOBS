const { supabase } = require("../config/db.js");

// 📊 Obtener estadísticas del Dashboard
exports.getStats = async (req, res, next) => {
  try {
    // Usa la identificación del usuario autenticado o la pasada por query
    const identificacion = req.query.identificacion || req.user.identificacion;

    const now = new Date();
    const nowISO = now.toISOString();
    const in15 = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString();

    // 🔹 Consultas paralelas
    const [
      documentos,
      alertas,
      contratos,
      proximos
    ] = await Promise.all([
      // Documentos completados
      supabase
        .from("documentos")
        .select("id", { head: true, count: "exact" })
        .eq("identificacion", identificacion)
        .eq("estado", "completado"),

      // Alertas no leídas
      supabase
        .from("alertas")
        .select("id", { head: true, count: "exact" })
        .eq("identificacion", identificacion)
        .eq("leido", false),

      // Contratos activos (fecha actual entre inicio y fin)
      supabase
        .from("contratos")
        .select("id", { head: true, count: "exact" })
        .eq("identificacion", identificacion)
        .lte("fechainicio", nowISO)
        .gte("fechafin", nowISO),

      // Documentos próximos a vencer (en los próximos 15 días)
      supabase
        .from("documentos")
        .select("id", { head: true, count: "exact" })
        .eq("identificacion", identificacion)
        .gte("fecha_vencimiento", nowISO)
        .lte("fecha_vencimiento", in15)
        .neq("estado", "completado"),
    ]);

    // 🔹 Verificar errores de cualquier consulta
    if (documentos.error || alertas.error || contratos.error || proximos.error)
      throw (
        documentos.error ||
        alertas.error ||
        contratos.error ||
        proximos.error
      );

    // 🔹 Enviar respuesta JSON
    res.status(200).json({
      success: true,
      message: "Estadísticas obtenidas correctamente",
      data: {
        documentosCompletados: documentos.count || 0,
        alertasActivas: alertas.count || 0,
        contratosActivos: contratos.count || 0,
        proximosVencimientos: proximos.count || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
