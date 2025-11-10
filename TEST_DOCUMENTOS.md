# 🧪 Pruebas de Endpoints de Documentos

## 📋 Pre-requisitos

1. **Servidor corriendo**: Ejecuta `npm run dev` o `npm start`
2. **Token JWT**: Necesitas autenticarte primero para obtener un token
3. **Cloudinary configurado**: Asegúrate de tener las credenciales en `.env`

## 🔐 1. Obtener Token de Autenticación

Primero debes hacer login para obtener el token JWT:

```http
POST http://localhost:5500/api/users/login
Content-Type: application/json

{
  "correo": "tu-correo@ejemplo.com",
  "password": "tu-password"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "identificacion": "123456789",
    "rol": "candidato"
  }
}
```

> ⚠️ **Guarda el token**, lo necesitarás en el header `Authorization: Bearer <token>` para todas las siguientes peticiones.

---

## 📤 2. Subir Archivo a Cloudinary

**Endpoint:** `POST /api/documentos/upload`

### Usando cURL (PowerShell):

```powershell
$token = "TU_TOKEN_JWT_AQUI"
$filePath = "C:\ruta\al\archivo.pdf"

curl.exe -X POST http://localhost:5500/api/documentos/upload `
  -H "Authorization: Bearer $token" `
  -F "file=@$filePath"
```

### Usando Thunder Client / Postman:

1. **Method:** POST
2. **URL:** `http://localhost:5500/api/documentos/upload`
3. **Headers:**
   - `Authorization`: `Bearer TU_TOKEN_JWT_AQUI`
4. **Body:** (form-data)
   - Key: `file` (tipo: File)
   - Value: Selecciona tu archivo

**Respuesta esperada (200):**
```json
{
  "message": "✅ Archivo subido correctamente",
  "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456789/archivo.pdf",
  "public_id": "archivo_abc123"
}
```

---

## 📄 3. Crear Registro de Documento

**Endpoint:** `POST /api/documentos`

Usa este endpoint cuando ya tengas una URL (por ejemplo, después de subir a Cloudinary).

### Usando cURL:

```powershell
$token = "TU_TOKEN_JWT_AQUI"

curl.exe -X POST http://localhost:5500/api/documentos `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre_documento": "CV Actualizado",
    "tipo": "curriculum",
    "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456789/cv.pdf"
  }'
```

### Usando Thunder Client / Postman:

1. **Method:** POST
2. **URL:** `http://localhost:5500/api/documentos`
3. **Headers:**
   - `Authorization`: `Bearer TU_TOKEN_JWT_AQUI`
   - `Content-Type`: `application/json`
4. **Body:** (raw JSON)
```json
{
  "nombre_documento": "CV Actualizado",
  "tipo": "curriculum",
  "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456789/cv.pdf"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "message": "Documento creado correctamente.",
  "data": {
    "id": 1,
    "nombre_documento": "CV Actualizado",
    "tipo": "curriculum",
    "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456789/cv.pdf",
    "candidato": "123456789",
    "created_at": "2025-11-09T23:00:00.000Z"
  }
}
```

---

## 👀 4. Obtener Documentos del Usuario

**Endpoint:** `GET /api/documentos`

Este endpoint devuelve todos los documentos del usuario autenticado.

### Usando cURL:

```powershell
$token = "TU_TOKEN_JWT_AQUI"

curl.exe -X GET http://localhost:5500/api/documentos `
  -H "Authorization: Bearer $token"
```

### Usando Thunder Client / Postman:

1. **Method:** GET
2. **URL:** `http://localhost:5500/api/documentos`
3. **Headers:**
   - `Authorization`: `Bearer TU_TOKEN_JWT_AQUI`

**Respuesta esperada (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre_documento": "CV Actualizado",
      "tipo": "curriculum",
      "url": "https://res.cloudinary.com/tu-cloud/image/upload/v123456789/cv.pdf",
      "candidato": "123456789",
      "created_at": "2025-11-09T23:00:00.000Z"
    },
    {
      "id": 2,
      "nombre_documento": "Certificado de Estudios",
      "tipo": "certificado",
      "url": "https://res.cloudinary.com/tu-cloud/image/upload/v987654321/cert.pdf",
      "candidato": "123456789",
      "created_at": "2025-11-09T22:30:00.000Z"
    }
  ]
}
```

---

## 🗑️ 5. Eliminar Documento (Solo Admin)

**Endpoint:** `DELETE /api/documentos/:id`

⚠️ **Requiere rol de admin**

### Usando cURL:

```powershell
$token = "TOKEN_DE_ADMIN_AQUI"
$documentId = 1

curl.exe -X DELETE "http://localhost:5500/api/documentos/$documentId" `
  -H "Authorization: Bearer $token"
```

### Usando Thunder Client / Postman:

1. **Method:** DELETE
2. **URL:** `http://localhost:5500/api/documentos/1` (cambia el ID)
3. **Headers:**
   - `Authorization`: `Bearer TOKEN_DE_ADMIN_AQUI`

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Documento eliminado correctamente."
}
```

---

## 🧪 Flujo Completo de Prueba

### Escenario: Usuario sube su CV

```powershell
# 1. Login
$loginResponse = curl.exe -X POST http://localhost:5500/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"correo": "juan@ejemplo.com", "password": "123456"}' | ConvertFrom-Json

$token = $loginResponse.token

# 2. Subir archivo a Cloudinary
$uploadResponse = curl.exe -X POST http://localhost:5500/api/documentos/upload `
  -H "Authorization: Bearer $token" `
  -F "file=@C:\Users\andre\Documents\cv.pdf" | ConvertFrom-Json

$cloudinaryUrl = $uploadResponse.url

# 3. Crear registro del documento
curl.exe -X POST http://localhost:5500/api/documentos `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d "{\"nombre_documento\": \"Curriculum Vitae\", \"tipo\": \"curriculum\", \"url\": \"$cloudinaryUrl\"}"

# 4. Ver todos mis documentos
curl.exe -X GET http://localhost:5500/api/documentos `
  -H "Authorization: Bearer $token"
```

---

## ❌ Casos de Error

### Error 400 - Campos obligatorios faltantes
```json
{
  "success": false,
  "message": "Faltan campos obligatorios (nombre_documento, tipo o url)."
}
```

### Error 400 - No se envió archivo
```json
{
  "error": "No se ha enviado ningún archivo"
}
```

### Error 401 - No autenticado
```json
{
  "error": "Token no proporcionado"
}
```

### Error 403 - Sin permisos (para DELETE)
```json
{
  "error": "Acceso denegado. Se requiere uno de los siguientes roles: admin"
}
```

### Error 500 - Error en Cloudinary
```json
{
  "error": "Error al subir a Cloudinary"
}
```

---

## 📝 Notas Importantes

1. **Orden de middleware en upload**: El middleware `auth` debe ir **antes** de `upload.single("file")` para validar el token primero.

2. **Tipos de documentos sugeridos**: 
   - `curriculum`
   - `certificado`
   - `carta_presentacion`
   - `diploma`
   - `otro`

3. **Cloudinary**: Asegúrate de tener estas variables en tu `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   ```

4. **Limite de tamaño**: El middleware `uploadMiddleware.js` tiene un límite de 20MB por archivo.

5. **Formatos aceptados**: Cloudinary acepta múltiples formatos (PDF, imágenes, etc.) gracias a `resource_type: "auto"`.
