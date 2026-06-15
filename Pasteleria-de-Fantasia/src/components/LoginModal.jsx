import React, { useState } from 'react';
import { loginUsuario,registrarUsuario,registrarLog } from '../services/api';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');

  const [captchaA] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaB] = useState(Math.floor(Math.random() * 9) + 1);
  const [captcha, setCaptcha] = useState('');

  const [error, setError] = useState('');
  const [modoRegistro, setModoRegistro] = useState(false);

  const obtenerFuerzaPassword = (password) => {
    if (password.length < 6)
        return 'Débil';
    if (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password)
    )
        return 'Fuerte';

    return 'Media';
    };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (modoRegistro) {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registrarUsuario({
        nombre,
        email,
        password,
        rol: 'usuario'
      });

      alert('Usuario registrado correctamente');
      setModoRegistro(false);
      setNombre('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      return;

    } catch (error) {
      setError('No se pudo registrar el usuario');
      return;
    }
  }

  if (Number(captcha) !== captchaA + captchaB) {
    setError('Captcha incorrecto');
    return;
  }

  try {
    const respuesta = await loginUsuario({
      email,
      password
    });

    localStorage.setItem('token', respuesta.token);
    localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));

    await registrarLog({
      usuario: respuesta.usuario.email,
      evento: 'ingreso'
    });

    onClose();
    window.location.reload();

  } catch (error) {
    setError('Correo o contraseña incorrectos');
  }
};
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4">

          <div className="modal-header">
            <h5 className="modal-title">
                {modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            <div className="d-flex gap-2 mb-3">
                <button
                    type="button"
                    className={`btn flex-fill ${!modoRegistro ? 'btn-pasteleria' : 'btn-outline-secondary'}`}
                    onClick={() => setModoRegistro(false)}
                >
                    Login
                </button>

                <button
                    type="button"
                    className={`btn flex-fill ${modoRegistro ? 'btn-pasteleria' : 'btn-outline-secondary'}`}
                    onClick={() => setModoRegistro(true)}
                >
                    Registrarse
                </button>
            </div>
            <form onSubmit={handleSubmit}>
              {modoRegistro && (
                <input
                   className="form-control mb-3"
                   type="text"
                   placeholder="Nombre completo"
                   value={nombre}
                   onChange={(e) => setNombre(e.target.value)}
                   required
                 />
               )}
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                className="form-control mb-3"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {modoRegistro && (
              <>
              <input
                className="form-control mb-2"
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
          
              <div className="mb-3 small">
                Seguridad de contraseña: <strong>{obtenerFuerzaPassword(password)}</strong>
              </div>
            </>
            )}
              {!modoRegistro && (
                <>
                    <label className="form-label">
                    CAPTCHA: ¿Cuánto es {captchaA} + {captchaB}?
                    </label>

                    <input
                    className="form-control mb-3"
                    type="number"
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    required
                    />
                </>
                )}
            <button className="btn btn-pasteleria w-100">
            {modoRegistro ? 'Registrarse' : 'Ingresar'}
            </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}