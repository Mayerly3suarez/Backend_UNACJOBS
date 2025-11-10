const { supabase } = require("../config/db.js");

async function generarAlertasVencimiento(diasAntes = 15) {
  try {
    const fechaActual = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaActual.getDate() + diasAntes);

    // Obtener documentos con fecha de vencimiento próxima
    const { data: documentos, error: docError } = await supabase
      .from("documentos")
      .select("id, nombre_documento, fecha_vencimiento, candidato, estado")
      .lte("fecha_vencimiento", fechaLimite.toISOString())
      .neq("estado", "completado");

    if (docError) throw docError;
    if (!documentos || documentos.length === 0) return [];

    const alerts = [];

    for (const doc of documentos) {
      // Obtener nombre del usuario (opcional)
      const { data: usuario, error: userError } = await supabase
        .from("usuario")
        .select("nombre")
        .eq("identificacion", doc.candidato)
        .maybeSingle();

      if (userError) throw userError;

      const mensaje = `El documento "${doc.nombre_documento}" del usuario ${
        usuario?.nombre || "N/A"
      } vence el ${new Date(doc.fecha_vencimiento).toLocaleDateString()}`;

      // Crear alerta
      const { data: alerta, error: alertError } = await supabase
        .from("alertas")
        .insert([
          {
            mensaje,
            fechaalerta: new Date().toISOString(),
            userid: doc.candidato,
            documentoid: doc.id,
          },
        ])
        .select()
        .single();

      if (alertError) throw alertError;
      alerts.push(alerta);
    }

    return alerts;
  } catch (err) {
    console.error("Error generando alertas:", err);
    throw err;
  }
}

module.exports = { generarAlertasVencimiento };
