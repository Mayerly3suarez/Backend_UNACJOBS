// controllers/alertController.js
const { supabase } = require("../config/db.js");

exports.getAlertsByUser = async (req, res, next) => {
  try {
    const userId = req.user.identificacion;

    const { data: alerts, error } = await supabase
      .from("alertas")
      .select("*")
      .eq("userid", userId);

    if (error) throw error;

    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const alertId = req.params.id;
    const userId = req.user.id;

    // Verificar si la alerta existe
    const { data: alert, error: fetchError } = await supabase
      .from("alertas")
      .select("*")
      .eq("id", alertId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;
    if (!alert) return res.status(404).json({ error: "Alerta no encontrada" });

    // Verificar permisos
    if (alert.userid !== userId && req.user.rol !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    // Actualizar estado a leído
    const { data: updatedAlert, error: updateError } = await supabase
      .from("alertas")
      .update({ leido: true })
      .eq("id", alertId)
      .select()
      .single();

    if (updateError) throw updateError;

    res.json({ message: "Alerta marcada como leída", alert: updatedAlert });
  } catch (err) {
    next(err);
  }
};
