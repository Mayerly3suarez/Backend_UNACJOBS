const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  // Chequeo rápido de env
  if (!supabaseUrl || !supabaseKey) {
    return {
      connected: false,
      message: 'Faltan SUPABASE_URL o SUPABASE_KEY en las variables de entorno',
      supabaseUrl: supabaseUrl || null
    }
  }

  try {
    // Intento mínimo sobre tablas REALES del esquema (según tu diagrama)
    const tablesToProbe = ['usuario','documentos','vacantes','postulaciones','usuario_candidato']

    for (const tbl of tablesToProbe) {
      // HEAD-only select to avoid depender de nombres de columnas
      const { error } = await supabase.from(tbl).select('*', { head: true, count: 'exact' })
      if (!error) {
        return { connected: true, message: `Conexión exitosa (probado en ${tbl})`, supabaseUrl }
      }
      // PGRST116/PGRST205 = relación/tabla no encontrada: conexión ok pero la tabla consultada no existe
      if (error.code !== 'PGRST116' && error.code !== 'PGRST205') {
        // Cualquier otro error indica conectividad/autorización pero evita usar information_schema
        return {
          connected: true,
          message: 'Conexión exitosa pero error al consultar tabla de prueba',
          supabaseUrl,
          error: { message: error.message, details: error.details || null, hint: error.hint || null, code: error.code || null }
        }
      }
    }

    // Si llegamos aquí, no se hallaron tablas conocidas, pero la conexión al backend REST funciona
    return {
      connected: true,
      message: 'Conexión exitosa (no se encontraron tablas conocidas: Usuarios/Documentos/Contratos)'
    }
  } catch (err) {
    return {
      connected: false,
      message: `Error de conexión: ${err.message}`,
      supabaseUrl
    }
  }
}

// Función para listar las tablas
async function listTables() {
  try {
    // Preferido: RPC definida en la BD (crear en Supabase si no existe)
    const { data, error } = await supabase.rpc('get_tables_info')

    if (error && error.code === 'PGRST202') {
      // Sin RPC disponible: no consultar information_schema vía PostgREST (no está expuesto)
      return {
        success: true,
        message: 'Conexión OK. Define la función RPC get_tables_info en la BD si deseas listar tablas desde la API.' ,
        tables: []
      }
    }

    if (error) throw error

    return {
      success: true,
      tables: data || []
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
      message: 'Error al listar las tablas'
    }
  }
}

const DEFAULT_TABLES = ['usuario','documentos','vacantes','postulaciones','usuario_candidato']

async function probeTable(table) {
  try {
    const { error, count } = await supabase.from(table).select('*', { head: true, count: 'exact' })
    if (!error) {
      return { table, reachable: true, exists: true, count }
    }
    if (error.code === 'PGRST116' || error.code === 'PGRST205') {
      return { table, reachable: true, exists: false, error: { code: error.code, message: error.message } }
    }
    return { table, reachable: true, exists: null, error: { code: error.code || null, message: error.message, details: error.details || null } }
  } catch (err) {
    return { table, reachable: false, exists: null, error: { message: err.message } }
  }
}

async function testAllTables(tables = DEFAULT_TABLES) {
  const results = await Promise.all(tables.map(t => probeTable(t)))
  return {
    success: true,
    probed: tables,
    results,
    anyReachable: results.some(r => r.reachable),
    anyExists: results.some(r => r.exists === true)
  }
}

module.exports = {
  supabase,
  testConnection,
  listTables,
  testAllTables,
  probeTable
}
