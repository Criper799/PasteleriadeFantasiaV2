import express from 'express';

import {
  obtProductos,
  obtProductoPorID,
  insertaProducto,
  actualizaProducto,
  eliminaProducto
} from '../controladores/productoControlador.js';

const rutas = express.Router();

rutas.get('/', obtProductos);
rutas.get('/:id', obtProductoPorID);
rutas.post('/', insertaProducto);
rutas.put('/:id', actualizaProducto);
rutas.delete('/:id', eliminaProducto);

export default rutas;