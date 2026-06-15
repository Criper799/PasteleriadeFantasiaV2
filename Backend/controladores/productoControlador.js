import {
  obtTodos,
  obtProducto,
  inserta,
  actualiza,
  eliminaLogico
} from '../modelos/productoModelo.js';

const formatearProducto = (p) => ({
  id: p.id,
  name: p.nombre,
  category: p.categoria,
  price: p.precio,
  image: p.imagen,
  description: p.descripcion,
  ingredients: p.ingredientes ? p.ingredientes.split(',').map(i => i.trim()) : [],
  allergens: p.alergenos ? p.alergenos.split(',').map(a => a.trim()) : [],
  portions: p.porciones ? p.porciones.split(',').map(Number) : [],
  isFeatured: p.es_popular === 1
});

export const obtProductos = async (req, res) => {
  try {
    const productos = await obtTodos();
    res.json(productos.map(formatearProducto));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtProductoPorID = async (req, res) => {
  try {
    const producto = await obtProducto(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(formatearProducto(producto));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const insertaProducto = async (req, res) => {
  try {
    const id = await inserta(req.body);

    res.status(201).json({
      mensaje: 'Producto registrado correctamente',
      id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const actualizaProducto = async (req, res) => {
  try {
    const producto = await obtProducto(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await actualiza(req.params.id, req.body);

    res.json({
      mensaje: 'Producto actualizado correctamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminaProducto = async (req, res) => {
  try {
    const producto = await obtProducto(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    await eliminaLogico(req.params.id);

    res.json({
      mensaje: 'Producto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};