const axios = require("axios");
require("dotenv").config();

const flowUrl = process.env.POWER_AUTOMATE_FLOW_URL;

function assertFlowEnv() {
  if (!flowUrl) {
    const msg = "Falta POWER_AUTOMATE_FLOW_URL en .env (URL del Flow con disparador HTTP)";
    console.error("⚠️ Configuración incompleta de Power Automate:", msg);
    throw new Error(msg);
  }
}

/**
 * Sube archivo vía Power Automate (HTTP trigger) y deja que el Flow lo escriba en SharePoint.
 * Se espera que el Flow responda con JSON que incluya al menos { webUrl?, id?, name? }.
 * @param {Buffer} buffer
 * @param {string} fileName
 * @param {string} contentType
 */
async function uploadFile(buffer, fileName, contentType) {
  try {
    assertFlowEnv();

    const payload = {
      fileName,
      contentType: contentType || "application/octet-stream",
      fileBase64: buffer.toString("base64"),
    };

    const res = await axios.post(flowUrl, payload, {
      headers: { "Content-Type": "application/json" },
      // Nota: el URL del Flow ya incluye el token firmado (si aplica). No añadimos auth aquí.
      timeout: 60_000,
    });

    const data = res.data || {};
    return {
      id: data.id,
      name: data.name || fileName,
      webUrl: data.webUrl, // ideal que el Flow devuelva esto
      raw: data,
    };
  } catch (err) {
    console.error("❌ Error subiendo archivo vía Power Automate:", err.response?.data || err.message);
    throw new Error("No se pudo subir el archivo mediante Power Automate");
  }
}

module.exports = { uploadFile };
