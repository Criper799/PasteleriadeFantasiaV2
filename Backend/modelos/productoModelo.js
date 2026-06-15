import { pool } from '../config/bd.js';

export const obtTodos = async () => {
  const [resultado] = await pool.query(
    'SELECT * FROM productos WHERE estado = TRUE'
  );
  return resultado;
};

export const obtProducto = async (id) => {
  const [resultado] = await pool.query(
    'SELECT * FROM productos WHERE id = ? AND estado = TRUE',
    [id]
  );
  return resultado[0];
};

export const inserta = async (producto) => {
  const {
    nombre,
    categoria,
    precio,
    imagen,
    descripcion,
    ingredientes,
    alergenos,
    porciones,
    es_popular
  } = producto;

  const [resultado] = await pool.query(
    `INSERT INTO productos
    (nombre, categoria, precio, imagen, descripcion, ingredientes, alergenos, porciones, es_popular, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)`,
    [nombre, categoria, precio, imagen, descripcion, ingredientes, alergenos, porciones, es_popular]
  );

  return resultado.insertId;
};

export const actualiza = async (id, producto) => {
  const {
    nombre,
    categoria,
    precio,
    imagen,
    descripcion,
    ingredientes,
    alergenos,
    porciones,
    es_popular
  } = producto;

  await pool.query(
    `UPDATE productos
    SET nombre=?, categoria=?, precio=?, imagen=?, descripcion=?,
    ingredientes=?, alergenos=?, porciones=?, es_popular=?
    WHERE id=?`,
    [nombre, categoria, precio, imagen, descripcion, ingredientes, alergenos, porciones, es_popular, id]
  );
};

export const eliminaLogico = async (id) => {
  await pool.query(
    'UPDATE productos SET estado = FALSE WHERE id = ?',
    [id]
  );
};