import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CakeDesigner() {
  const { addCustomCakeToCart } = useCart();
  const [step, setStep] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Opciones de configuración
  const portionOptions = [
    { value: 15, label: '15 Porciones (Mediano)', price: 18000, desc: 'Ideal para cumpleaños íntimos' },
    { value: 25, label: '25 Porciones (Grande)', price: 28000, desc: 'Ideal para fiestas familiares' },
    { value: 45, label: '45 Porciones (Familiar)', price: 45000, desc: 'Ideal para eventos grandes' }
  ];

  const spongeOptions = [
    { value: 'vainilla', label: 'Vainilla Francesa', color: '#fbeed4', price: 0 },
    { value: 'chocolate', label: 'Chocolate Fudge', color: '#543d2b', price: 1000 },
    { value: 'red-velvet', label: 'Red Velvet', color: '#8b191c', price: 1500 },
    { value: 'zanahoria-nuez', label: 'Zanahoria & Nuez', color: '#d29662', price: 2000 }
  ];

  const fillingOptions = [
    { value: 'dulce-leche', label: 'Dulce de Leche Artesanal', color: '#c68a4c' },
    { value: 'crema-pastelera', label: 'Crema Pastelera de Vainilla', color: '#fff5c0' },
    { value: 'mermelada-frutilla', label: 'Mermelada de Frutilla Natural', color: '#db3a34' },
    { value: 'ganache-chocolate', label: 'Ganache de Chocolate Belga', color: '#32221a' },
    { value: 'crema-avellanas', label: 'Crema de Avellanas y Cacao', color: '#442b15' }
  ];

  const frostingOptions = [
    { value: 'crema-chantilly', label: 'Crema Chantilly Clásica', color: '#ffffff', price: 0 },
    { value: 'fondant-art', label: 'Fondant Artístico (Decorativo)', color: '#fcf6f5', price: 3000 },
    { value: 'merengue-italiano', label: 'Merengue Italiano Sopleteado', color: '#fff9e6', price: 1000 },
    { value: 'glaseado-chocolate', label: 'Glaseado Brillante de Chocolate', color: '#3b281f', price: 2000 }
  ];

  // Estado del pastel personalizado
  const [selectedPortions, setSelectedPortions] = useState(portionOptions[0]);
  const [selectedSponge, setSelectedSponge] = useState(spongeOptions[0]);
  const [selectedFillings, setSelectedFillings] = useState([fillingOptions[0].value]);
  const [selectedFrosting, setSelectedFrosting] = useState(frostingOptions[0]);
  const [cakeText, setCakeText] = useState('');

  // Manejo de la selección de rellenos (Máximo 2)
  const handleFillingToggle = (value) => {
    setSelectedFillings((prev) => {
      if (prev.includes(value)) {
        // Al menos debe quedar un relleno seleccionado
        if (prev.length === 1) return prev;
        return prev.filter((f) => f !== value);
      } else {
        // Límite de 2 rellenos
        if (prev.length >= 2) {
          const updated = [...prev];
          updated.shift(); // Saca el primero e inserta el nuevo al final
          return [...updated, value];
        }
        return [...prev, value];
      }
    });
  };

  // Calcular precio en base a las opciones elegidas
  const calculatePrice = () => {
    let total = selectedPortions.price;
    total += selectedSponge.price;
    // Cada relleno adicional después del primero suma 1000
    total += (selectedFillings.length - 1) * 1200;
    total += selectedFrosting.price;
    return total;
  };

  const currentPrice = calculatePrice();

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(value);
  };

  const handleAddCustomCake = () => {
    const fullFillingsLabels = selectedFillings.map(
      (val) => fillingOptions.find((opt) => opt.value === val)?.label
    );

    const customCakeDetails = {
      portions: selectedPortions.value,
      sponge: selectedSponge.label,
      fillings: fullFillingsLabels,
      frosting: selectedFrosting.label,
      cakeText: cakeText || '(Sin mensaje)',
      price: currentPrice
    };

    addCustomCakeToCart(customCakeDetails, 1);
    
    // Feedback y reset
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      // Reset a valores iniciales
      setStep(1);
      setSelectedPortions(portionOptions[0]);
      setSelectedSponge(spongeOptions[0]);
      setSelectedFillings([fillingOptions[0].value]);
      setSelectedFrosting(frostingOptions[0]);
      setCakeText('');
    }, 2500);
  };

  return (
    <section id="diseñador" className="py-5" style={{ backgroundColor: 'var(--color-cream-bg)' }}>
      <div className="container py-4">
        {/* Encabezado */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-8 px-4">
            <h2 className="display-6 mb-3 fs-2 text-brown-dark">Crea tu Torta de Fantasía</h2>
            <div className="mx-auto bg-primary mb-3" style={{ width: '60px', height: '2px' }}></div>
            <p className="text-muted">
              Diseña la torta perfecta para tu evento. Elige las porciones, el bizcocho, los rellenos, la cobertura y agrega un mensaje personalizado. ¡Visualiza tu diseño al instante!
            </p>
          </div>
        </div>

        <div className="row g-5 align-items-stretch px-3">
          {/* Columna Izquierda: Vista Previa Interactiva */}
          <div className="col-lg-5 col-xl-4 d-flex flex-column align-items-center justify-content-center">
            <div className="card glass-card p-4 w-100 d-flex flex-column align-items-center text-center shadow-sm h-100">
              <h3 className="h5 text-brown-dark mb-4">Tu Pastel Personalizado</h3>
              
              {/* Contenedor del Pastel Visual (CSS) */}
              <div 
                className="cake-preview-box d-flex flex-column align-items-center justify-content-end mb-4 border border-light rounded-4 shadow-inner" 
                style={{ 
                  width: '100%', 
                  height: '240px', 
                  backgroundColor: '#fffcf7', 
                  position: 'relative',
                  paddingBottom: '20px'
                }}
              >
                {/* Plato de soporte de la torta */}
                <div 
                  className="cake-stand bg-secondary-subtle border-bottom border-secondary"
                  style={{
                    width: '220px',
                    height: '12px',
                    borderRadius: '50% / 100%',
                    position: 'absolute',
                    bottom: '12px',
                    zIndex: 1,
                    backgroundColor: '#d3d3d3'
                  }}
                ></div>

                {/* Cuerpo del Pastel */}
                <div 
                  className="cake-body-visual"
                  style={{
                    width: selectedPortions.value === 15 ? '140px' : selectedPortions.value === 25 ? '170px' : '200px',
                    height: '140px',
                    borderRadius: '10px 10px 20px 20px',
                    border: '3px solid',
                    borderColor: selectedFrosting.color === '#ffffff' ? '#e5cfc3' : selectedFrosting.color,
                    backgroundColor: selectedFrosting.color,
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    padding: '8px 0',
                    transition: 'all 0.5s ease',
                    boxShadow: 'inset -15px -15px 20px rgba(0,0,0,0.08), 0 8px 16px rgba(74, 55, 40, 0.15)'
                  }}
                >
                  {/* Capas de Bizcocho & Rellenos (Sección recortada que simula el interior) */}
                  <div 
                    className="cake-cutaway-layers overflow-hidden d-flex flex-column justify-content-between"
                    style={{
                      width: '80%',
                      height: '85%',
                      borderRadius: '4px',
                      border: '1px dashed rgba(0,0,0,0.15)',
                      backgroundColor: 'transparent',
                      padding: '4px'
                    }}
                  >
                    {/* Capa de bizcocho superior */}
                    <div className="sponge-layer" style={{ backgroundColor: selectedSponge.color, height: '18%', borderRadius: '2px', transition: 'all 0.5s' }}></div>
                    
                    {/* Relleno superior */}
                    <div className="filling-layer" style={{ 
                      backgroundColor: fillingOptions.find(f => f.value === selectedFillings[0])?.color || '#fff', 
                      height: '8%', 
                      borderRadius: '1px', 
                      transition: 'all 0.5s' 
                    }}></div>
                    
                    {/* Capa de bizcocho del medio */}
                    <div className="sponge-layer" style={{ backgroundColor: selectedSponge.color, height: '18%', borderRadius: '2px', transition: 'all 0.5s' }}></div>
                    
                    {/* Relleno inferior */}
                    <div className="filling-layer" style={{ 
                      backgroundColor: fillingOptions.find(f => f.value === (selectedFillings[1] || selectedFillings[0]))?.color || '#fff', 
                      height: '8%', 
                      borderRadius: '1px', 
                      transition: 'all 0.5s' 
                    }}></div>
                    
                    {/* Capa de bizcocho inferior */}
                    <div className="sponge-layer" style={{ backgroundColor: selectedSponge.color, height: '18%', borderRadius: '2px', transition: 'all 0.5s' }}></div>
                  </div>

                  {/* Letrero del mensaje escrito */}
                  {cakeText && (
                    <div 
                      className="position-absolute px-2 py-1 rounded shadow-sm text-center"
                      style={{
                        top: '40%',
                        left: '50%',
                        transform: 'translateX(-50%) rotate(-3deg)',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        border: '1px solid var(--color-pink-dark)',
                        maxWidth: '90%',
                        zIndex: 3,
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'var(--color-brown-dark)',
                        fontWeight: 'bold',
                        wordBreak: 'break-all'
                      }}
                    >
                      "{cakeText}"
                    </div>
                  )}
                </div>

                {/* Velitas arriba (Decorativo) */}
                <div 
                  className="position-absolute d-flex gap-2" 
                  style={{ top: '60px', zIndex: 1, transition: 'all 0.5s' }}
                >
                  <div style={{ width: '4px', height: '20px', background: 'linear-gradient(to top, blue, white)', position: 'relative' }}>
                    <span className="position-absolute bg-warning rounded-circle" style={{ width: '6px', height: '8px', top: '-7px', left: '-1px' }}></span>
                  </div>
                  <div style={{ width: '4px', height: '20px', background: 'linear-gradient(to top, pink, white)', position: 'relative' }}>
                    <span className="position-absolute bg-warning rounded-circle" style={{ width: '6px', height: '8px', top: '-7px', left: '-1px' }}></span>
                  </div>
                  <div style={{ width: '4px', height: '20px', background: 'linear-gradient(to top, green, white)', position: 'relative' }}>
                    <span className="position-absolute bg-warning rounded-circle" style={{ width: '6px', height: '8px', top: '-7px', left: '-1px' }}></span>
                  </div>
                </div>
              </div>

              {/* Ficha Resumen */}
              <div className="text-start w-100 border-top pt-3 text-muted small">
                <p className="mb-1"><strong>Tamaño:</strong> {selectedPortions.label}</p>
                <p className="mb-1"><strong>Bizcocho:</strong> {selectedSponge.label}</p>
                <p className="mb-1">
                  <strong>Rellenos:</strong> {selectedFillings.map(val => fillingOptions.find(f => f.value === val)?.label).join(' y ')}
                </p>
                <p className="mb-1"><strong>Cobertura:</strong> {selectedFrosting.label}</p>
                <p className="mb-3"><strong>Texto:</strong> <span className={cakeText ? 'text-dark fw-bold' : 'fst-italic'}>{cakeText || '(Sin mensaje)'}</span></p>
                
                <div className="d-flex align-items-center justify-content-between border-top pt-3">
                  <span className="text-dark fw-semibold fs-5">Total:</span>
                  <span className="h4 fw-bold text-brown-dark mb-0">{formatPrice(currentPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Configuración Paso a Paso */}
          <div className="col-lg-7 col-xl-8">
            <div className="card glass-card p-4 p-md-5 h-100 shadow-sm d-flex flex-column justify-content-between">
              
              {/* Barra de progreso */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 position-relative px-2">
                  {/* Línea de fondo del progreso */}
                  <div 
                    className="position-absolute top-50 start-0 translate-middle-y bg-secondary-subtle" 
                    style={{ width: '100%', height: '3px', zIndex: 1 }}
                  ></div>
                  <div 
                    className="position-absolute top-50 start-0 translate-middle-y bg-primary" 
                    style={{ 
                      width: `${((step - 1) / 4) * 100}%`, 
                      height: '3px', 
                      zIndex: 1,
                      transition: 'width 0.4s ease'
                    }}
                  ></div>

                  {[1, 2, 3, 4, 5].map((s) => (
                    <div 
                      key={s} 
                      className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
                      onClick={() => s <= step || s === step + 1 ? setStep(s) : null}
                      style={{ cursor: 'pointer' }}
                    >
                      {step > s ? <i className="bi bi-check-lg"></i> : s}
                    </div>
                  ))}
                </div>

                <h3 className="h4 text-brown-dark mb-4">
                  {step === 1 && 'Paso 1: Selecciona el Tamaño'}
                  {step === 2 && 'Paso 2: Elige el Sabor del Bizcocho'}
                  {step === 3 && 'Paso 3: Escoge tus Relleno(s) (Máximo 2)'}
                  {step === 4 && 'Paso 4: Elige la Cobertura / Frosting'}
                  {step === 5 && 'Paso 5: Agrega un Mensaje y Confirma'}
                </h3>
              </div>

              {/* Contenido Dinámico de los Pasos */}
              <div className="my-4 flex-grow-1">
                {/* PASO 1: Tamaño */}
                {step === 1 && (
                  <div className="row g-3">
                    {portionOptions.map((opt) => (
                      <div className="col-md-4" key={opt.value}>
                        <div 
                          className={`designer-card-option h-100 d-flex flex-column justify-content-between ${selectedPortions.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setSelectedPortions(opt)}
                        >
                          <div>
                            <i className="bi bi-circle-square fs-3 text-primary mb-2 d-block"></i>
                            <h4 className="h6 fw-bold mb-1">{opt.label}</h4>
                            <p className="text-muted small mb-3">{opt.desc}</p>
                          </div>
                          <span className="fw-bold text-brown-dark fs-5 mt-auto">
                            {formatPrice(opt.price)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PASO 2: Bizcocho */}
                {step === 2 && (
                  <div className="row g-3">
                    {spongeOptions.map((opt) => (
                      <div className="col-md-6" key={opt.value}>
                        <div 
                          className={`designer-card-option d-flex align-items-center gap-3 ${selectedSponge.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setSelectedSponge(opt)}
                        >
                          <div 
                            className="rounded border" 
                            style={{ width: '40px', height: '40px', backgroundColor: opt.color }}
                          ></div>
                          <div className="text-start flex-grow-1">
                            <h4 className="h6 fw-bold mb-0">{opt.label}</h4>
                            {opt.price > 0 ? (
                              <span className="small text-primary">+{formatPrice(opt.price)}</span>
                            ) : (
                              <span className="small text-muted">Incluido en base</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PASO 3: Rellenos */}
                {step === 3 && (
                  <div>
                    <p className="text-muted small mb-3">Haz clic en los sabores para seleccionarlos. Si seleccionas un segundo, se combinarán las capas.</p>
                    <div className="row g-3">
                      {fillingOptions.map((opt) => {
                        const isSelected = selectedFillings.includes(opt.value);
                        return (
                          <div className="col-md-6" key={opt.value}>
                            <div 
                              className={`designer-card-option d-flex align-items-center gap-3 ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleFillingToggle(opt.value)}
                            >
                              <div 
                                className="rounded-circle border" 
                                style={{ width: '30px', height: '30px', backgroundColor: opt.color }}
                              ></div>
                              <div className="text-start flex-grow-1 d-flex justify-content-between align-items-center">
                                <h4 className="h6 fw-bold mb-0">{opt.label}</h4>
                                {isSelected && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* PASO 4: Cobertura */}
                {step === 4 && (
                  <div className="row g-3">
                    {frostingOptions.map((opt) => (
                      <div className="col-md-6" key={opt.value}>
                        <div 
                          className={`designer-card-option d-flex align-items-center gap-3 ${selectedFrosting.value === opt.value ? 'selected' : ''}`}
                          onClick={() => setSelectedFrosting(opt)}
                        >
                          <div 
                            className="rounded border" 
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: opt.color, 
                              border: opt.color === '#ffffff' ? '1px solid #ddd' : 'none' 
                            }}
                          ></div>
                          <div className="text-start flex-grow-1">
                            <h4 className="h6 fw-bold mb-0">{opt.label}</h4>
                            {opt.price > 0 ? (
                              <span className="small text-primary">+{formatPrice(opt.price)}</span>
                            ) : (
                              <span className="small text-muted">Incluido en base</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* PASO 5: Confirmación e Impresión del texto */}
                {step === 5 && (
                  <div className="text-start">
                    <div className="mb-4">
                      <label htmlFor="cakeText" className="form-label fw-semibold text-brown-dark mb-1">
                        Mensaje escrito sobre la torta (Máximo 30 caracteres)
                      </label>
                      <input 
                        type="text" 
                        id="cakeText"
                        className="form-control border-secondary-subtle focus-ring"
                        placeholder="Ej: ¡Feliz Cumpleaños Mamá!"
                        maxLength={30}
                        value={cakeText}
                        onChange={(e) => setCakeText(e.target.value)}
                      />
                      <span className="small text-muted mt-1 d-block text-end">
                        {cakeText.length}/30 caracteres
                      </span>
                    </div>

                    <div className="p-4 rounded-3 bg-light border border-light-subtle shadow-inner">
                      <h4 className="h6 fw-bold text-brown-dark mb-3">Términos del encargo:</h4>
                      <ul className="small text-muted mb-0 ps-3">
                        <li>Las tortas personalizadas requieren al menos <strong>48 horas</strong> de anticipación para su elaboración.</li>
                        <li>Las decoraciones de bizcochos e ingredientes están sujetas a disponibilidad del día de preparación.</li>
                        <li>En caso de alérgenos severos, te sugerimos contactarnos directamente antes de encargar.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Botones de Navegación del Wizard */}
              <div className="d-flex align-items-center justify-content-between pt-4 border-top">
                <button 
                  className="btn btn-pasteleria-outline px-4"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  <i className="bi bi-arrow-left me-2"></i> Atrás
                </button>

                {step < 5 ? (
                  <button 
                    className="btn btn-pasteleria-dark px-4"
                    onClick={() => setStep(Math.min(5, step + 1))}
                  >
                    Siguiente <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button 
                    className="btn btn-pasteleria px-4 d-flex align-items-center gap-2"
                    onClick={handleAddCustomCake}
                    disabled={addedFeedback}
                  >
                    {addedFeedback ? (
                      <>
                        <i className="bi bi-check-circle-fill text-success fs-5 animate-pulse"></i>
                        ¡Agregada con éxito!
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus fs-5"></i>
                        Añadir Torta de Fantasía
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
