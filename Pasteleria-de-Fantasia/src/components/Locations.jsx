import React from 'react';
import { LOCATIONS } from '../data/products';

export default function Locations() {
  return (
    <section id="ubicacion" className="py-5" style={{ backgroundColor: 'var(--color-white)' }}>
      <div className="container py-4">
        {/* Encabezado */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-6 px-4">
            <h2 className="display-6 mb-3 fs-2 text-brown-dark">Nuestras Ubicaciones</h2>
            <div className="mx-auto bg-primary mb-3" style={{ width: '60px', height: '2px' }}></div>
            <p className="text-muted">Visítanos en cualquiera de nuestras sucursales y disfruta de la mejor pastelería.</p>
          </div>
        </div>

        {/* Rejilla de Sucursales */}
        <div className="row g-4 justify-content-center px-3">
          {LOCATIONS.map((loc) => (
            <div className="col-lg-4 col-md-6 animate-fade-in" key={loc.id}>
              <div className="card glass-card h-100 shadow-sm overflow-hidden border-0">
                {/* Contenedor del Mapa (Iframe original) */}
                <div className="map-container" style={{ height: '200px' }}>
                  <iframe 
                    src={loc.embedUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title={loc.name}
                  ></iframe>
                </div>

                {/* Detalles de la sucursal */}
                <div className="card-body p-4 text-start">
                  <h3 className="h5 fw-bold text-brown-dark mb-3">
                    <i className="bi bi-geo-alt-fill text-primary me-2"></i> {loc.name}
                  </h3>
                  
                  <p className="small text-muted mb-2 d-flex align-items-start gap-2">
                    <i className="bi bi-map mt-0.5 text-secondary"></i>
                    <span>{loc.address}</span>
                  </p>

                  <p className="small text-muted mb-2 d-flex align-items-center gap-2">
                    <i className="bi bi-telephone text-secondary"></i>
                    <span>{loc.phone}</span>
                  </p>

                  <div className="border-top pt-2 mt-3 text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-clock-fill text-secondary me-1.5"></i>
                    <strong>Horario: </strong>
                    <span className="d-block mt-1">{loc.schedule}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
