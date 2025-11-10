// Shim controller to maintain existing route imports and names
// Re-exports from documentscontroller.js, preserving the upload handler name used in routes

const {
  createDocument,
  getDocumentsByUser,
  deleteDocument,
  uploadToCloudinary,
} = require("./documentscontroller.js");

module.exports = {
  createDocument,
  getDocumentsByUser,
  deleteDocument,
  uploadToCloudinary,
};
