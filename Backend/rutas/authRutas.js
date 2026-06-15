import express from 'express';

import {
  registrarUsuario,
  loginUsuario
} from '../controladores/authControlador.js';

const rutas = express.Router();

rutas.post('/registro', registrarUsuario);
rutas.post('/login', loginUsuario);

export default rutas;