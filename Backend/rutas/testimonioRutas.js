import express
from 'express';

import {
    obtTestimonios,
    insertaTestimonio
}
from '../controladores/testimonioControlador.js';

const rutas =
    express.Router();

rutas.get(
    '/',
    obtTestimonios
);

rutas.post(
    '/',
    insertaTestimonio
);

export default rutas;