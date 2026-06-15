import {
  insertarLog,
  obtenerLogs
} from '../modelos/logModelo.js';

export const registrarLog = async (req, res) => {
  try {
    const { usuario, evento } = req.body;

    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress;

    const navegador =
      req.headers['user-agent'];

    const id = await insertarLog({
      usuario,
      ip,
      evento,
      navegador
    });

    res.status(201).json({
      mensaje: 'Log registrado',
      id
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const listarLogs = async (req, res) => {
  try {
    const logs = await obtenerLogs();

    res.json(logs);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};