import React, { useState } from 'react';

export default function Footer() {
  // Estado para el formulario de contacto
  const [contactForm, setContactForm] = useState({
    nombre: '',
    correo: '',
    mensaje: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, correo, mensaje } = contactForm;

    if (!nombre.trim() || !correo.trim() || !mensaje.trim()) {
      setErrorMsg('Por favor completa todos los campos del formulario.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      setErrorMsg('Por favor introduce un correo electrónico válido.');
      return;
    }

    // Simular el envío exitoso
    setSubmitted(true);
    setContactForm({ nombre: '', correo: '', mensaje: '' });
    
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <footer>
      {/* Sección del Formulario de Contacto */}
      <section className="contact-section-bg" id="contacto">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 px-4">
              <div className="text-center mb-4">
                <h2 className="display-6 text-white mb-2 fs-2">Contacta con Nosotros</h2>
                <div className="mx-auto bg-primary mb-3" style={{ width: '60px', height: '2px' }}></div>
                <p className="text-white-50 small">¿Tienes dudas o deseas cotizar un pedido corporativo? Escríbenos y te responderemos a la brevedad.</p>
              </div>

              {submitted && (
                <div className="alert alert-success border-0 py-2.5 px-3 mb-4 animate-fade-in text-start" role="alert">
                  <i className="bi bi-send-check-fill me-2 fs-5"></i> ¡Mensaje enviado con éxito! Te contactaremos pronto.
                </div>
              )}

              {errorMsg && (
                <div className="alert alert-danger border-0 py-2 px-3 mb-4 text-start" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form d-flex flex-column gap-3">
                <div>
                  <input 
                    type="text" 
                    name="nombre"
                    className="form-control w-100" 
                    placeholder="Tu Nombre" 
                    value={contactForm.nombre}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    name="correo"
                    className="form-control w-100" 
                    placeholder="Tu Correo Electrónico" 
                    value={contactForm.correo}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div>
                  <textarea 
                    name="mensaje"
                    rows="4" 
                    className="form-control w-100" 
                    placeholder="Escribe tu consulta o mensaje aquí..." 
                    value={contactForm.mensaje}
                    onChange={handleChange}
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-pasteleria px-5 py-2.5 fw-bold">
                    <i className="bi bi-send-fill me-2" style={{ fontSize: '0.9rem' }}></i> Contactar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer de información general */}
      <footer className="bg-dark text-white pt-5 pb-4 text-start">
        <div className="container">
          <div className="row g-4 justify-content-between">
            {/* Contacto */}
            <div className="col-lg-4 col-md-6 px-4">
              <h5 className="h6 fw-bold text-uppercase mb-4 border-bottom border-secondary pb-2 text-white-50">Contacto</h5>
              <p className="small mb-2 d-flex align-items-center gap-2 text-white-50">
                <i className="bi bi-geo-alt text-primary fs-5"></i>
                <span>Av. 20 de Octubre esq. Aspiazu, Sopocachi, La Paz</span>
              </p>
              <p className="small mb-2 d-flex align-items-center gap-2 text-white-50">
                <i className="bi bi-telephone text-primary fs-5"></i>
                <span>+591 2 2441234 / +591 71234567</span>
              </p>
              <p className="small mb-0 d-flex align-items-center gap-2 text-white-50">
                <i className="bi bi-envelope text-primary fs-5"></i>
                <span>contacto@pasteleriafantasia.com</span>
              </p>
            </div>

            {/* Horarios */}
            <div className="col-lg-3 col-md-6 px-4">
              <h5 className="h6 fw-bold text-uppercase mb-4 border-bottom border-secondary pb-2 text-white-50">Horarios</h5>
              <div className="small text-white-50">
                <p className="mb-2 d-flex justify-content-between">
                  <span>Lunes a Viernes:</span>
                  <span>7:00 am - 8:00 pm</span>
                </p>
                <p className="mb-2 d-flex justify-content-between">
                  <span>Sábados:</span>
                  <span>8:00 am - 9:00 pm</span>
                </p>
                <p className="mb-0 d-flex justify-content-between">
                  <span>Domingos:</span>
                  <span className="text-warning">9:00 am - 5:00 pm *</span>
                </p>
                <span className="d-block mt-2 text-muted" style={{ fontSize: '0.7rem' }}>* Solo sucursal Calacoto</span>
              </div>
            </div>

            {/* Síguenos */}
            <div className="col-lg-4 col-md-12 px-4 text-start">
              <h5 className="h6 fw-bold text-uppercase mb-4 border-bottom border-secondary pb-2 text-white-50">Síguenos</h5>
              <p className="small text-white-50 mb-3">Encuentra más fotos de nuestras tortas y entérate de nuestras promociones diarias en redes sociales:</p>
              <div className="d-flex gap-3">
                <a 
                  href="#" 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" 
                  style={{ width: '40px', height: '40px', backgroundColor: '#3b5998', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title="Facebook"
                >
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                <a 
                  href="#" 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" 
                  style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title="Instagram"
                >
                  <i className="bi bi-instagram fs-5"></i>
                </a>
                <a 
                  href="#" 
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" 
                  style={{ width: '40px', height: '40px', backgroundColor: '#1da1f2', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title="Twitter (X)"
                >
                  <i className="bi bi-twitter-x fs-5"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-top border-secondary mt-4 pt-4 text-center text-white-50 small">
            <p className="mb-0">© {new Date().getFullYear()} Pastelería De Fantasía. Creado en React & Bootstrap.</p>
          </div>
        </div>
      </footer>
    </footer>
  );
}
