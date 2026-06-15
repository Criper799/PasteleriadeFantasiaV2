import React, { useEffect, useState } from 'react';
import { obtProductos, insertaProducto, actualizaProducto, eliminaProducto } from '../services/api';
import GraficoResenas from './GraficoResenas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    imagen: '',
    descripcion: '',
    ingredientes: '',
    alergenos: '',
    porciones: '',
    es_popular: 0
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const datos = await obtProductos();
      setProductos(datos);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    });
  };

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      categoria: '',
      precio: '',
      imagen: '',
      descripcion: '',
      ingredientes: '',
      alergenos: '',
      porciones: '',
      es_popular: 0
    });

    setEditandoId(null);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await actualizaProducto(editandoId, form);
      } else {
        await insertaProducto(form);
      }

      limpiarFormulario();
      cargarProductos();

    } catch (error) {
      console.error(error);
      alert('Error al guardar producto');
    }
  };

  const editarProducto = (producto) => {
    setEditandoId(producto.id);

    setForm({
      nombre: producto.name || '',
      categoria: producto.category || '',
      precio: producto.price || '',
      imagen: producto.image || '',
      descripcion: producto.description || '',
      ingredientes: Array.isArray(producto.ingredients)
        ? producto.ingredients.join(', ')
        : producto.ingredients || '',
      alergenos: Array.isArray(producto.allergens)
        ? producto.allergens.join(', ')
        : producto.allergens || '',
      porciones: Array.isArray(producto.portions)
        ? producto.portions.join(', ')
        : producto.portions || '',
      es_popular: producto.isFeatured ? 1 : 0
    });

    document
      .getElementById('admin-productos')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const borrarProducto = async (id) => {
    const confirmar = confirm('¿Seguro que quieres eliminar este producto?');

    if (!confirmar) return;

    try {
      await eliminaProducto(id);
      cargarProductos();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar producto');
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB',
      minimumFractionDigits: 0
    }).format(value);
  };

  const generarReporteProductos = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Pastelería de Fantasía', 14, 20);

    doc.setFontSize(12);
    doc.text('Reporte de Productos', 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Nombre', 'Categoría', 'Precio', 'Popular']],
      body: productos.map((p) => [
        p.id,
        p.name,
        p.category,
        formatPrice(p.price),
        p.isFeatured ? 'Sí' : 'No'
      ])
    });

    doc.save('reporte_productos.pdf');
  };

  return (
    <section id="admin-productos" className="container py-5">
      <h2 className="mb-4 text-brown-dark">
        Panel de Administración
      </h2>
      <button
        className="btn btn-danger mb-4"
        onClick={generarReporteProductos}
      >
        Generar PDF de Productos
      </button>
      <form onSubmit={guardarProducto} className="card p-4 mb-5 shadow-sm">
        <h4 className="mb-3">
          {editandoId ? 'Editar producto' : 'Nuevo producto'}
        </h4>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              name="categoria"
              className="form-control"
              placeholder="Categoría"
              value={form.categoria}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              name="precio"
              type="number"
              className="form-control"
              placeholder="Precio"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              name="imagen"
              className="form-control"
              placeholder="/img/producto.jpg"
              value={form.imagen}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <textarea
              name="descripcion"
              className="form-control"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="col-md-4">
            <input
              name="ingredientes"
              className="form-control"
              placeholder="Ingredientes separados por coma"
              value={form.ingredientes}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <input
              name="alergenos"
              className="form-control"
              placeholder="Alérgenos separados por coma"
              value={form.alergenos}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              name="porciones"
              className="form-control"
              placeholder="10,20,30"
              value={form.porciones}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12 form-check ms-2">
            <input
              className="form-check-input"
              type="checkbox"
              name="es_popular"
              checked={form.es_popular === 1}
              onChange={handleChange}
            />

            <label className="form-check-label">
              Producto popular
            </label>
          </div>
        </div>

        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-pasteleria">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>

          {editandoId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={limpiarFormulario}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Popular</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <img
                    src={producto.image}
                    alt={producto.name}
                    style={{
                      width: '70px',
                      height: '55px',
                      objectFit: 'cover'
                    }}
                  />
                </td>

                <td>{producto.name}</td>
                <td>{producto.category}</td>
                <td>{producto.price}</td>
                <td>{producto.isFeatured ? 'Sí' : 'No'}</td>

                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => editarProducto(producto)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => borrarProducto(producto.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <hr className="my-5" />
      <GraficoResenas />
    </section>
  );
}