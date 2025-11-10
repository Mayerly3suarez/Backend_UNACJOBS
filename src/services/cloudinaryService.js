const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Permite configurar con CLOUDINARY_URL o con variables separadas
if (process.env.CLOUDINARY_URL) {
  // La SDK lee CLOUDINARY_URL automáticamente; añadimos secure
  cloudinary.config({ secure: true });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

function assertEnv() {
  // cloudinary.v2 también acepta CLOUDINARY_URL, pero validamos si nada está configurado
  const hasUrl = !!process.env.CLOUDINARY_URL;
  const hasParts = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
  if (!hasUrl && !hasParts) {
    const msg = "Faltan variables de entorno de Cloudinary (CLOUDINARY_URL o CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)";
    console.error("⚠️ Configuración incompleta de Cloudinary:", msg);
    throw new Error(msg);
  }
}

/**
 * Sube un archivo a Cloudinary usando un stream en memoria
 * @param {Buffer} buffer
 * @param {string} fileName - nombre sugerido (se usará para public_id)
 * @param {string} contentType - mimetype
 * @returns {Promise<{ id: string, url: string, raw: any }>}
 */
async function uploadFile(buffer, fileName, contentType) {
  assertEnv();

  const baseName = (fileName || `file-${Date.now()}`).replace(/\.[^.]+$/, "");
  const folder = process.env.CLOUDINARY_FOLDER || "unacjobs/documents";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto", // permite PDF, imágenes, etc.
        public_id: baseName,
        overwrite: true,
        use_filename: true,
        unique_filename: false,
        type: "upload" // usa "authenticated" si quieres URLs restringidas con token
      },
      (error, result) => {
        if (error) {
          console.error("❌ Error subiendo a Cloudinary:", error);
          return reject(new Error("No se pudo subir el archivo a Cloudinary"));
        }
        resolve({ id: result.public_id, url: result.secure_url || result.url, raw: result });
      }
    );

    uploadStream.on("error", err => {
      console.error("❌ Error en el stream de Cloudinary:", err);
      reject(new Error("Fallo el stream de subida a Cloudinary"));
    });

    uploadStream.end(buffer);
  });
}

module.exports = { uploadFile };