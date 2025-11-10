const { supabase } = require("../config/db.js");
const { uploadFile: uploadToCloudinary } = require("../services/cloudinaryService.js");

exports.getDocumentsByUser = async (req, res, next) => {
  try {
    const requestedUserId = req.query.userId;
    const isPrivileged = ["admin", "docente"].includes(req.user?.rol);
    const selfId = req.user?.identificacion || req.user?.id || req.user?.userId || req.user?.sub;
    const userId = isPrivileged && requestedUserId ? requestedUserId : selfId;

    if (!userId) return res.status(401).json({ error: "Usuario no identificado en el token" });

    const { data, error } = await supabase
      .from("documentos")
      .select("*")
      .eq("candidato", userId);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    next(err);
  }
};

exports.createDocument = async (req, res, next) => {
  try {
    const { nombre_documento, tipo, url } = req.body;

    const userId = req.user?.identificacion || req.user?.id || req.user?.userId || req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Usuario no identificado en el token" });

    const { data, error } = await supabase
      .from("documentos")
      .insert([{ candidato: userId, nombre_documento, tipo, url }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Documento creado", data });
  } catch (err) {
    next(err);
  }
};

// 📤 Subir archivo a Cloudinary y crear registro en BD
exports.uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido (campo 'file')" });

    const userId = req.user?.identificacion || req.user?.id || req.user?.userId || req.user?.sub;
    if (!userId) return res.status(401).json({ error: "Usuario no identificado en el token" });

    const nombre_documento = req.body?.nombre_documento || req.file.originalname;
    const tipo = req.body?.tipo || req.file.mimetype;

    const safeName = `${userId}-${Date.now()}-${req.file.originalname}`.replace(/[^a-zA-Z0-9_.-]/g, "_");

    // Subir archivo a Cloudinary
    const cld = await uploadToCloudinary(req.file.buffer, safeName, req.file.mimetype);

    // Guardar registro en BD con la URL de Cloudinary
    const { data, error } = await supabase
      .from("documentos")
      .insert([{ candidato: userId, nombre_documento, tipo, url: cld.url }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: "Documento subido", cloudinary: cld, data });
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("documentos")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Documento eliminado" });
  } catch (err) {
    next(err);
  }
};
