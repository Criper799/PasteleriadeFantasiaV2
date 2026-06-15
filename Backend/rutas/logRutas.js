import express from 'express';

import {
  registrarLog,
  listarLogs
} from '../controladores/logControlador.js';

const rutas = express.Router();

rutas.post('/', registrarLog);
rutas.get('/', listarLogs);

export default rutas;