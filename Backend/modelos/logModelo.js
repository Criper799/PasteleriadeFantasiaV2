import { pool } from '../config/bd.js';

export const insertarLog = async (datos) => {
  const { usuario, ip, evento, navegador } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO log_acceso
    (usuario, ip, evento, navegador)
    VALUES (?, ?, ?, ?)`,
    [usuario, ip, evento, navegador]
  );

  return resultado.insertId;
};

export const obtenerLogs = async () => {
  const [resultado] = await pool.query(
    'SELECT * FROM log_acceso ORDER BY fecha_hora DESC'
  );

  return resultado;
};