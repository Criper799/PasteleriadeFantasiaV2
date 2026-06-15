import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [selectedPortions, setSelectedPortions] = useState(1);
  const [quantity, setQuantity] = useState(1);

  // Reiniciar valores al abrir un producto diferente
  useEffect(() => {
    if (product) {
      setSelectedPortions(product.portions[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Cálculo de precio escalado
  const computedPrice = (() => {
    const basePrice = product.price;
    const basePortion = product.portions[0];
    
    if (selectedPortions === basePortion || !selectedPortions) {
      return basePrice;
    }
    const ratio = selectedPortions / basePortion;
    return Math.round(basePrice * (1 + (ratio - 1) * 0.7)); // 70% de aumento por porción
  })();

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(value);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedPortions);
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(74, 55, 40, 0.6)', backdropFilter: 'blur(6px)', zIndex: 1050 }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 rounded-4 overflow-hidden glass-card shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 bg-transparent pt-4 px-4 pb-0 justify-content-end">
            <button 
              type="button" 
              className="btn-close rounded-circle bg-light p-2 shadow-sm border border-secondary-subtle" 
              onClick={onClose} 
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body p-4 p-md-5 pt-0">
            <div className="row g-4 align-items-center">
              {/* Imagen del Producto */}
              <div className="col-md-5">
                <div className="rounded-3 overflow-hidden shadow-sm border border-light" style={{ height: '320px' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-100 h-100 object-fit-cover" 
                  />
                </div>
              </div>

              {/* Detalles del Producto */}
              <div className="col-md-7 text-start">
                <span className="badge bg-light border text-dark text-uppercase tracking-wider mb-2" style={{ color: 'var(--color-pink-dark)' }}>
                  {product.category}
                </span>
                <h2 className="h3 mb-3 text-brown-dark">{product.name}</h2>
                <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>{product.description}</p>

                {/* Ingredientes */}
                <h3 className="h6 fw-bold text-brown-dark mb-2">Ingredientes principales:</h3>
                <ul className="text-muted small ps-3 mb-4">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>

                {/* Alérgenos */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mb-4">
                    <span className="small fw-semibold text-brown-dark me-2 d-inline-block mb-1">Alérgenos:</span>
                    {product.allergens.map((aller, i) => (
                      <span key={i} className="badge bg-danger-subtle text-danger border border-danger-subtle me-1.5 rounded-pill py-1 px-2.5">
                        ⚠️ {aller}
                      </span>
                    ))}
                  </div>
                )}

                {/* Selectores */}
                <div className="row g-3 align-items-end mb-4 pt-3 border-top border-light">
                  {/* Selector de Porciones */}
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-brown-dark mb-1.5">
                      {product.category === 'tortas' ? 'Porciones / Tamaño' : 'Cantidad en el Pack'}
                    </label>
                    <select 
                      className="form-select border-secondary-subtle focus-ring"
                      value={selectedPortions} 
                      onChange={(e) => setSelectedPortions(Number(e.target.value))}
                    >
                      {product.portions.map((port) => (
                        <option key={port} value={port}>
                          {port} {product.category === 'tortas' ? 'Porciones' : 'Unidades'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cantidad */}
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-brown-dark mb-1.5">Cantidad</label>
                    <div className="input-group border border-secondary-subtle rounded overflow-hidden">
                      <button 
                        className="btn btn-light border-0" 
                        type="button" 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input 
                        type="text" 
                        className="form-control border-0 text-center bg-white" 
                        value={quantity} 
                        readOnly 
                        style={{ width: '40px' }}
                      />
                      <button 
                        className="btn btn-light border-0" 
                        type="button" 
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fila Final: Precio y Compra */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light">
                  <div>
                    <span className="small text-muted d-block">Subtotal estimado</span>
                    <span className="h4 fw-bold text-brown-dark mb-0">{formatPrice(computedPrice * quantity)}</span>
                  </div>
                  <button 
                    className="btn btn-pasteleria px-4"
                    onClick={handleAddToCart}
                  >
                    <i className="bi bi-cart-plus me-2"></i> Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
