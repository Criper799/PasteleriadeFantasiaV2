import express
from 'express';

import {
    registraPedido
}
from '../controladores/pedidoControlador.js';

const rutas =
    express.Router();

rutas.post(
    '/',
    registraPedido
);

export default rutas;