import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import { registrarLog } from '../services/api';

export default function Navbar({ onCartToggle, onDesignerScroll, onCatalogScroll }) {
  const { cartCount } = useCart();
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cerrarSesion = async () => {
    try {
      if (usuario) {
        await registrarLog({
          usuario: usuario.email,
          evento: 'salida'
        });
      }
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 85; // Altura aproximada del navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Si el menú colapsable está abierto en móvil, cerrarlo
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = window.bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top glass-navbar py-2">
        <div className="container">
          {/* Logotipo */}
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={(e) => handleScrollTo(e, 'home')}>
            <img 
              src="/img/Logotipo.png" 
              alt="Pastelería De Fantasía" 
              className="img-fluid" 
              style={{ width: '85px', height: '60px', objectFit: 'contain' }} 
            />
          </a>

          {/* Botón Carrito Móvil */}
          <button 
            className="btn btn-pasteleria-outline d-lg-none position-relative me-2 px-3 py-1"
            onClick={onCartToggle}
            aria-label="Abrir carrito"
          >
            <i className="bi bi-cart3 fs-5"></i>
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {cartCount}
              </span>
            )}
          </button>

          {/* Toggler para móviles */}
          <button 
            className="navbar-toggler border-0 focus-ring" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menú de navegación */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item px-2">
                <a className="nav-link fw-medium text-dark" href="#" onClick={(e) => handleScrollTo(e, 'home')}>
                  <i className="bi bi-cake2 me-1"></i> Inicio
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link fw-medium text-dark" href="#" onClick={(e) => handleScrollTo(e, 'productos')}>
                  <i className="bi bi-box2-heart me-1"></i> Catálogo
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link fw-medium text-dark" href="#" onClick={(e) => handleScrollTo(e, 'ubicacion')}>
                  <i className="bi bi-compass me-1"></i> Sucursales
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link fw-medium text-dark" href="#" onClick={(e) => handleScrollTo(e, 'testimonios')}>
                  <i className="bi bi-chat-heart me-1"></i> Reseñas
                </a>
              </li>
              <li className="nav-item px-2">
                <a className="nav-link fw-medium text-dark" href="#" onClick={(e) => handleScrollTo(e, 'contacto')}>
                  <i className="bi bi-envelope me-1"></i> Contacto
                </a>
              </li>
              {/* Inicio y cierre de Sesión */}
              {usuario ? (
                <li className="nav-item dropdown ms-lg-3">
                  <button
                    className="btn btn-pasteleria dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    {usuario.nombre}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow">
                    {usuario.rol === 'admin' && (
                      <>
                        <li>
                          <button
                            className="dropdown-item text-warning fw-bold"
                            onClick={(e) => handleScrollTo(e, 'admin-productos')}
                          >
                            Administración
                          </button>
                        </li>

                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </>
                    )}

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={cerrarSesion}
                      >
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item ms-lg-3">
                  <button
                    className="btn btn-pasteleria"
                    onClick={() => setMostrarLogin(true)}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Ingresar
                  </button>
                </li>
              )}
              {/* Botón Carrito de Escritorio */}
              <li className="nav-item ms-lg-3 d-none d-lg-block">
                <button 
                  className="btn btn-pasteleria d-flex align-items-center gap-2 position-relative"
                  onClick={onCartToggle}
                >
                  <i className="bi bi-cart3 fs-5"></i>
                  <span className="fw-semibold">Carrito</span>
                  {cartCount > 0 && (
                    <span className="badge rounded-pill bg-dark text-white px-2 py-1 cart-badge">
                      {cartCount}
                    </span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <LoginModal isOpen={mostrarLogin} onClose={() => setMostrarLogin(false)}/>
    </>
  );
}
