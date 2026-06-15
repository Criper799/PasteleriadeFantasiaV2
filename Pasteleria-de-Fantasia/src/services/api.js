import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

/* PRODUCTOS */

export const obtProductos = async () => {
    const respuesta = await axios.get(
        `${API_URL}/productos`
    );

    return respuesta.data;
};

export const obtProducto = async (id) => {
    const respuesta = await axios.get(
        `${API_URL}/productos/${id}`
    );

    return respuesta.data;
};

/* TESTIMONIOS */

export const obtTestimonios = async () => {
    const respuesta = await axios.get(
        `${API_URL}/testimonios`
    );

    return respuesta.data;
};

export const insertaTestimonio = async (datos) => {
    const respuesta = await axios.post(
        `${API_URL}/testimonios`,
        datos
    );

    return respuesta.data;
};

/* PEDIDOS */

export const registraPedido = async (pedido) => {
    const respuesta = await axios.post(
        `${API_URL}/pedidos`,
        pedido
    );

    return respuesta.data;
};

/* Registro */

export const registrarUsuario = async (usuario) => {
  const respuesta = await axios.post(
    `${API_URL}/auth/registro`,
    usuario
  );

  return respuesta.data;
};

export const loginUsuario = async (datos) => {
  const respuesta = await axios.post(
    `${API_URL}/auth/login`,
    datos
  );

  return respuesta.data;
};

/*Panel de control de administrador*/

export const insertaProducto = async (producto) => {
  const respuesta = await axios.post(
    `${API_URL}/productos`,
    producto
  );

  return respuesta.data;
};

export const actualizaProducto = async (id, producto) => {
  const respuesta = await axios.put(
    `${API_URL}/productos/${id}`,
    producto
  );

  return respuesta.data;
};

export const eliminaProducto = async (id) => {
  const respuesta = await axios.delete(
    `${API_URL}/productos/${id}`
  );

  return respuesta.data;
};

/* Log de usuarios */

export const registrarLog = async (datos) => {
  const respuesta = await axios.post(
    `${API_URL}/logs`,
    datos
  );

  return respuesta.data;
};

export const obtLogs = async () => {
  const respuesta = await axios.get(
    `${API_URL}/logs`
  );

  return respuesta.data;
};