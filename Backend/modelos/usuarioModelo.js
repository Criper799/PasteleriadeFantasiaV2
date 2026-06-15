import { pool } from '../config/bd.js';

export const buscarUsuarioPorEmail = async (email) => {
  const [resultado] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ? AND estado = TRUE',
    [email]
  );

  return resultado[0];
};

export const insertarUsuario = async (usuario) => {
  const { nombre, email, password, rol } = usuario;

  const [resultado] = await pool.query(
    `INSERT INTO usuarios
    (nombre, email, password, rol)
    VALUES (?, ?, ?, ?)`,
    [nombre, email, password, rol || 'usuario']
  );

  return resultado.insertId;
};