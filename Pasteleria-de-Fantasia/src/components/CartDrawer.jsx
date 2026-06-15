import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, removeFromCart, updateQuantity, getProductPrice, cartTotal } = useCart();

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(value);
  };

  const handleCheckoutClick = () => {
    onClose();
    onCheckout();
  };

  return (
    <>
      {/* Overlay translúcido del fondo */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? 'show' : ''}`} 
        onClick={onClose}
      ></div>

      {/* Panel del Carrito Deslizable */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''} p-4`}>
        {/* Encabezado del Carrito */}
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-4">
          <h3 className="h4 mb-0 text-brown-dark d-flex align-items-center gap-2">
            <i className="bi bi-cart3"></i> Tu Carrito
          </h3>
          <button 
            type="button" 
            className="btn-close text-reset focus-ring" 
            onClick={onClose} 
            aria-label="Cerrar"
          ></button>
        </div>

        {/* Contenido del Carrito */}
        <div className="flex-grow-1 overflow-y-auto mb-4 pe-1">
          {cart.length > 0 ? (
            <div className="d-flex flex-column gap-3">
              {cart.map((item) => {
                const itemPrice = getProductPrice(item);
                return (
                  <div className="cart-item p-3 d-flex align-items-start gap-3" key={item.id}>
                    {/* Imagen del Producto */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="rounded object-fit-cover shadow-sm border"
                      style={{ width: '64px', height: '64px' }}
                    />

                    {/* Detalles */}
                    <div className="flex-grow-1 text-start">
                      <h4 className="h6 fw-bold mb-1 text-brown-dark">{item.product.name}</h4>
                      
                      {/* Detalles para tortas personalizadas */}
                      {item.isCustom ? (
                        <div className="small text-muted mb-2 lh-sm" style={{ fontSize: '0.75rem' }}>
                          <p className="mb-0.5">🍰 Bizcocho: {item.customDetails.sponge}</p>
                          <p className="mb-0.5">🍯 Relleno: {item.customDetails.fillings.join(', ')}</p>
                          <p className="mb-0.5">🧁 Cobertura: {item.customDetails.frosting}</p>
                          <p className="mb-0 fst-italic">✍️ Mensaje: "{item.customDetails.cakeText}"</p>
                        </div>
                      ) : (
                        /* Detalle para productos estándar */
                        <p className="small text-muted mb-2">
                          Tamaño: {item.selectedPortions} {item.product.category === 'tortas' ? 'Porciones' : 'Unidades'}
                        </p>
                      )}

                      {/* Control de Cantidad y Precio */}
                      <div className="d-flex align-items-center justify-content-between">
                        {/* Selector de cantidad */}
                        <div className="input-group border border-secondary-subtle rounded overflow-hidden" style={{ width: '90px', height: '28px' }}>
                          <button 
                            className="btn btn-light border-0 py-0 px-2" 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash" style={{ fontSize: '0.75rem' }}></i>
                          </button>
                          <span className="form-control border-0 text-center bg-white p-0 fs-6 lh-lg" style={{ height: '28px' }}>
                            {item.quantity}
                          </span>
                          <button 
                            className="btn btn-light border-0 py-0 px-2" 
                            type="button" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus" style={{ fontSize: '0.75rem' }}></i>
                          </button>
                        </div>

                        {/* Precio */}
                        <span className="fw-semibold text-brown-dark small">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Botón de Remover */}
                    <button 
                      className="btn btn-sm btn-link text-danger border-0 p-0 fs-5 mt-1" 
                      onClick={() => removeFromCart(item.id)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Carrito Vacío */
            <div className="text-center py-5">
              <i className="bi bi-cart-x text-muted display-3 d-block mb-3"></i>
              <h4 className="h5 text-brown-dark">Tu carrito está vacío</h4>
              <p className="text-muted small">¡Explora nuestro catálogo para agregar postres deliciosos!</p>
              <button 
                className="btn btn-pasteleria-outline btn-sm mt-3"
                onClick={onClose}
              >
                Volver a la Tienda
              </button>
            </div>
          )}
        </div>

        {/* Footer del Carrito */}
        {cart.length > 0 && (
          <div className="border-top pt-4 text-start">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <span className="fs-5 fw-semibold text-brown-dark">Total estimado:</span>
              <span className="h3 fw-bold text-brown-dark mb-0">{formatPrice(cartTotal)}</span>
            </div>
            
            <button 
              className="btn btn-pasteleria w-100 py-2.5 fs-6 fw-bold"
              onClick={handleCheckoutClick}
            >
              <i className="bi bi-credit-card-2-front me-2"></i> Confirmar y Realizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
