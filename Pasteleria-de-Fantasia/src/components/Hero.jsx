import React, { useState } from 'react';

export default function Hero() {
  const [showMore, setShowMore] = useState(false);

  const handleScrollTo = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 85;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header id="home" className="hero-section text-center position-relative">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 animate-fade-in">
            {/* Título Principal */}
            <h1 className="display-1 text-white mb-2 fs-1 px-2">Pastelería De Fantasía</h1>
            
            {/* Línea Decorativa */}
            <div className="mx-auto bg-white mb-4" style={{ width: '120px', height: '3px', borderRadius: '2px' }}></div>
            
            {/* Subtítulo */}
            <p className="lead text-white-50 mb-5 px-3">
              El lugar donde probarás postres de Fantasía, creados con amor, dedicación y el toque mágico que alegra tus celebraciones.
            </p>

            {/* Botones de Acción */}
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
              <button 
                className="btn btn-pasteleria px-4 py-3"
                onClick={() => handleScrollTo('productos')}
              >
                <i className="bi bi-box2-heart me-2"></i> Ver Catálogo
              </button>
              <button 
                className="btn btn-pasteleria-outline text-white border-white px-4 py-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? (
                  <>
                    <i className="bi bi-chevron-up me-2"></i> Saber Menos
                  </>
                ) : (
                  <>
                    <i className="bi bi-chevron-down me-2"></i> Saber Más
                  </>
                )}
              </button>
            </div>

            {/* Sección "¿Quiénes Somos?" con colapso animado de React */}
            <div 
              className={`collapse-container overflow-hidden`} 
              style={{
                maxHeight: showMore ? '1000px' : '0px',
                transition: 'max-height 0.6s ease-in-out',
                opacity: showMore ? 1 : 0,
              }}
            >
              <div className="card glass-card text-start mx-auto p-4 p-md-5 my-4" style={{ maxWidth: '850px' }}>
                <div className="row align-items-center">
                  <div className="col-md-4 text-center mb-4 mb-md-0">
                    <img 
                      src="/img/Logotipo.png" 
                      alt="Logotipo" 
                      className="img-fluid rounded-circle p-2 bg-white shadow-sm"
                      style={{ maxWidth: '160px' }} 
                    />
                  </div>
                  <div className="col-md-8">
                    <h2 className="h3 mb-3 d-flex align-items-center text-brown-dark">
                      🍰 ¿Quiénes Somos?
                    </h2>
                    <p className="text-muted mb-3">
                      En <strong>Pastelería Fantasía</strong>, creemos que cada dulce tiene una historia que contar. Somos un equipo apasionado por el arte de la repostería, dedicados a crear momentos inolvidables a través de sabores únicos, texturas perfectas y diseños que deleitan tanto a la vista como al paladar.
                    </p>
                    <p className="text-muted">
                      Desde nuestros inicios, combinamos la tradición artesanal con las técnicas modernas de la pastelería profesional, ofreciendo productos elaborados con ingredientes frescos, naturales y cuidadosamente seleccionados. Nuestro taller es un espacio donde la creatividad y la precisión se encuentran para celebrar la vida en cada bocado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
