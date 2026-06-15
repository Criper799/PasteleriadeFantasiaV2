import React, { useState, useEffect } from 'react';
import { obtTestimonios,insertaTestimonio } from '../services/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Cargar testimonios desde el backend al montar
  useEffect(() => {
    const cargarTestimonios =
    async () => {

      try {

        const datos =
          await obtTestimonios();

        setTestimonials(datos);

      } catch (error) {

        console.error(error);

      }
    };

    cargarTestimonios();

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const reviewBody = {
      name: name.trim(),
      rating,
      comment: comment.trim()
    };
    try {
      const newReview =
        await insertaTestimonio(
          reviewBody
        );
        setTestimonials(
          (prev) => [
            newReview,
            ...prev
          ]
        );

    } catch (error) {
      console.error(error);
    }
    // Limpiar formulario y dar feedback
    setName('');
    setComment('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <i 
          key={index} 
          className={`bi ${starValue <= count ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} me-1`}
        ></i>
      );
    });
  };

  return (
    <section id="testimonios" className="py-5 bg-light">
      <div className="container py-4">
        {/* Encabezado */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-6 px-4">
            <h2 className="display-6 mb-3 fs-2 text-brown-dark">Opiniones de Nuestros Clientes</h2>
            <div className="mx-auto bg-primary mb-3" style={{ width: '60px', height: '2px' }}></div>
            <p className="text-muted">Conoce las experiencias de quienes ya han disfrutado de nuestras dulzuras.</p>
          </div>
        </div>

        <div className="row g-5 align-items-stretch px-3">
          {/* Columna Izquierda: Listado de opiniones */}
          <div className="col-lg-7 d-flex flex-column gap-3 overflow-y-auto" style={{ maxHeight: '520px', paddingRight: '10px' }}>
            {testimonials.map((test) => (
              <div 
                className="card glass-card p-4 text-start border-0 shadow-sm animate-fade-in" 
                key={test.id}
                style={{ transition: 'all 0.3s' }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="h6 fw-bold text-brown-dark mb-0">{test.name}</h4>
                  <span className="small text-muted" style={{ fontSize: '0.8rem' }}>{test.date}</span>
                </div>
                <div className="mb-2">
                  {renderStars(test.rating)}
                </div>
                <p className="text-muted small mb-0 fst-italic">"{test.comment}"</p>
              </div>
            ))}
          </div>

          {/* Columna Derecha: Formulario para añadir reseña */}
          <div className="col-lg-5">
            <div className="card glass-card p-4 p-md-5 h-100 shadow-sm border-0 text-start">
              <h3 className="h4 text-brown-dark mb-3">Deja tu Opinión</h3>
              <p className="text-muted small mb-4">Tu valoración es muy importante para seguir mejorando nuestras recetas.</p>

              {submitted && (
                <div className="alert alert-success border-0 small mb-4 py-2 px-3 animate-fade-in" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i> ¡Reseña agregada con éxito! Gracias por comentar.
                </div>
              )}

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 w-100">
                {/* Nombre */}
                <div>
                  <label htmlFor="reviewerName" className="form-label small fw-semibold text-brown-dark mb-1">Nombre</label>
                  <input 
                    type="text" 
                    id="reviewerName"
                    className="form-control border-secondary-subtle focus-ring"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Calificación Interactiva con Estrellas */}
                <div>
                  <label className="form-label small fw-semibold text-brown-dark mb-1 d-block">Calificación</label>
                  <div className="fs-4 d-inline-flex">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <i 
                        key={starValue} 
                        className={`bi ${starValue <= (hoverRating || rating) ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} cursor-pointer me-1`}
                        style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starValue)}
                      ></i>
                    ))}
                  </div>
                </div>

                {/* Comentario */}
                <div>
                  <label htmlFor="reviewerComment" className="form-label small fw-semibold text-brown-dark mb-1">Comentario</label>
                  <textarea 
                    id="reviewerComment"
                    rows="3"
                    className="form-control border-secondary-subtle focus-ring"
                    placeholder="Cuéntanos qué te pareció tu postre..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                {/* Botón */}
                <button 
                  type="submit" 
                  className="btn btn-pasteleria mt-2 py-2 fw-semibold"
                >
                  <i className="bi bi-chat-left-text me-2"></i> Enviar Reseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}