import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  buscarUsuarioPorEmail,
  insertarUsuario
} from '../modelos/usuarioModelo.js';

const JWT_SECRET = 'pasteleria_fantasia_2026';

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son obligatorios'
      });
    }

    const existe = await buscarUsuarioPorEmail(email);

    if (existe) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    const passwordEncriptado = await bcrypt.hash(password, 10);

    const id = await insertarUsuario({
      nombre,
      email,
      password: passwordEncriptado,
      rol: rol || 'usuario'
    });

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      id
    });

  } catch (error) {
    console.error('Error registrando usuario:', error);

    res.status(500).json({
      error: error.message
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Correo y contraseña son obligatorios'
      });
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const passwordValido = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordValido) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    res.json({
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);

    res.status(500).json({
      error: error.message
    });
  }
};