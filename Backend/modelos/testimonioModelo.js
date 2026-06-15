import { pool } from '../config/bd.js';

export const obtTodos = async () => {

    const [resultado] =
        await pool.query(
            'SELECT * FROM testimonios ORDER BY fecha DESC'
        );

    return resultado;
};

export const inserta = async (
    nombre,
    calificacion,
    comentario,
    fecha
) => {

    const [resultado] =
        await pool.query(
            `INSERT INTO testimonios
            (nombre, calificacion, comentario, fecha)
            VALUES (?, ?, ?, ?)`,
            [
                nombre,
                calificacion,
                comentario,
                fecha
            ]
        );

    return resultado.insertId;
};
