import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';


export default function Catalog({ products = [], onProductSelect }) {
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const [addedItemName, setAddedItemName] = useState(null);

  const categorias = useMemo(() => {
    const cats = [
      ...new Set(
        products.map(
          p => p.category
        )
      )
    ];

    return [
      {
        id: 'todos',
        name: 'Todos'
      },
      ...cats.map(cat => ({
        id: cat,
        name:
          cat.charAt(0).toUpperCase() +
          cat.slice(1)
      }))
    ];

  }, [products]);

  // Filtrado de productos utilizando useMemo para optimización
  const filteredProducts = useMemo(() => {
    const list = products && products.length > 0 ? products : [];
    return list.filter((product) => {
      const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleQuickAdd = (product) => {
    // Añade con la porción por defecto (la primera de la lista de porciones)
    const defaultPortion = product.portions?.[0] || 1;
    addToCart(product, 1, defaultPortion);
    
    // Mostrar feedback visual temporal
    setAddedItemName(product.name);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2500);
  };

  // Formatear precio a divisa local (Pesos/Bolivianos/etc., usaremos el formato estándar de moneda)
  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <section id="productos" className="py-5 bg-light">
      <div className="container py-4">
        {/* Encabezado del catálogo */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-md-6 px-4">
            <h2 className="display-6 mb-3 fs-2 text-brown-dark">Nuestro Catálogo Exquisito</h2>
            <div className="mx-auto bg-primary mb-3" style={{ width: '60px', height: '2px' }}></div>
            <p className="text-muted">Explora nuestras delicias preparadas diariamente. Filtra por tus gustos o busca tu postre preferido.</p>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros de Categorías */}
        <div className="row g-4 align-items-center justify-content-between mb-5 px-3">
          {/* Categorías */}
          <div className="col-lg-8 order-2 order-lg-1">
            <div className="d-flex flex-wrap justify-content-center justify-content-lg-start">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  className={`btn category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div className="col-lg-4 order-1 order-lg-2">
            <div className="input-group rounded-pill overflow-hidden border border-secondary-subtle bg-white p-1">
              <span className="input-group-text border-0 bg-transparent text-muted ps-3">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 focus-ring"
                placeholder="Buscar postres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.95rem' }}
              />
              {searchQuery && (
                <button 
                  className="btn border-0 bg-transparent text-muted pe-3" 
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Feedback visual de producto añadido (Toast flotante) */}
        {addedItemName && (
          <div 
            className="position-fixed bottom-0 start-50 translate-middle-x mb-4 bg-dark text-white py-3 px-4 rounded-3 shadow-lg d-flex align-items-center gap-3 z-3 border border-secondary"
            style={{ 
              animation: 'fadeInUp 0.3s ease',
              backgroundColor: '#4a3728' 
            }}
          >
            <i className="bi bi-check-circle-fill text-success fs-4"></i>
            <span>¡<strong>{addedItemName}</strong> agregado al carrito!</span>
          </div>
        )}

        {/* Rejilla de Productos */}
        {filteredProducts.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 px-3">
            {filteredProducts.map((product) => (
              <div className="col animate-fade-in" key={product.id}>
                <div className="card glass-card product-card h-100 shadow-sm">
                  {/* Imagen del producto */}
                  <div className="product-card-img-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-card-img img-fluid"
                      loading="lazy"
                    />
                    {product.isFeatured && (
                      <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark fw-bold px-2.5 py-1.5 shadow-sm">
                        ⭐ Popular
                      </span>
                    )}
                  </div>

                  {/* Cuerpo de la tarjeta */}
                  <div className="product-card-body d-flex flex-column p-4">
                    <span 
                      className="text-uppercase fw-semibold tracking-wider mb-2" 
                      style={{ fontSize: '0.75rem', color: 'var(--color-pink-dark)' }}
                    >
                      {categorias.find(c => c.id === product.category)?.name}
                    </span>
                    <h3 className="product-card-title h5 mb-2">{product.name}</h3>
                    <p className="text-muted small mb-4 flex-grow-1 text-start">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </p>

                    {/* Fila de Precio y Acciones */}
                    <div className="d-flex align-items-center justify-content-between mt-auto">
                      <span className="fs-5 fw-bold text-brown-dark">
                        {formatPrice(product.price)}
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-pasteleria-outline btn-sm px-3"
                          onClick={() => onProductSelect(product)}
                          title="Ver detalles"
                        >
                          Detalles
                        </button>
                        <button
                          className="btn btn-pasteleria btn-sm px-3"
                          onClick={() => handleQuickAdd(product)}
                          title="Añadir al carrito"
                        >
                          <i className="bi bi-cart-plus fs-6"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vacío */
          <div className="text-center py-5">
            <div className="display-4 text-muted mb-3">
              <i className="bi bi-emoji-frown"></i>
            </div>
            <h3 className="h4 text-brown-dark">No se encontraron productos</h3>
            <p className="text-muted">Prueba buscando otra palabra clave o cambiando el filtro de categorías.</p>
            <button 
              className="btn btn-pasteleria-outline mt-3"
              onClick={() => { setActiveCategory('todos'); setSearchQuery(''); }}
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
