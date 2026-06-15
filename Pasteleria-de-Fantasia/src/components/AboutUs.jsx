import React from 'react';

export default function AboutUs() {
  const features = [
    {
      icon: 'bi-flower1',
      title: 'Ingredientes Naturales',
      desc: 'Utilizamos frutas frescas, cacao 100% orgánico, mantequilla pura y ningún preservante artificial para garantizar un sabor real.'
    },
    {
      icon: 'bi-gem',
      title: 'Diseños Exclusivos',
      desc: 'Cada pastel es una obra de arte hecha a mano, adaptándonos al estilo de tu evento con precisión de repostería profesional.'
    },
    {
      icon: 'bi-heart-pulse',
      title: 'Hecho con Amor',
      desc: 'Horneamos en lotes pequeños cada mañana para asegurar que recibas productos frescos, esponjosos y llenos de cariño.'
    }
  ];

  return (
    <section className="about-section text-center">
      <div className="container py-4">
        {/* Encabezado */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 px-4">
            <h2 className="display-5 mb-3 fs-2 text-brown-dark">Simple & Pura Fantasía</h2>
            <div className="mx-auto bg-primary mb-4" style={{ width: '60px', height: '2px' }}></div>
            <p className="lead text-muted">
              En nuestra pastelería encontrarás una exquisita selección de tortas artesanales, cupcakes decorados, donas glaseadas, galletas recién salidas del horno y elegantes torres de macarons, todo elaborado con ingredientes de alta calidad y mucho amor.
            </p>
          </div>
        </div>

        {/* Pilares de Calidad */}
        <div className="row g-4 mt-2 px-3">
          {features.map((feat, index) => (
            <div className="col-md-4" key={index}>
              <div className="card glass-card h-100 p-4 rounded-3 border-0">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{ 
                    width: '70px', 
                    height: '70px', 
                    backgroundColor: 'var(--color-pink)',
                    color: 'var(--color-pink-dark)'
                  }}
                >
                  <i className={`bi ${feat.icon} fs-2`}></i>
                </div>
                <h3 className="h4 mb-3" style={{ color: 'var(--color-brown-dark)' }}>{feat.title}</h3>
                <p className="text-muted mb-0">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
