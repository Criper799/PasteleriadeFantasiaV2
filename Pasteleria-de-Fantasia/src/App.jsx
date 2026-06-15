import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Catalog from './components/Catalog';
import CakeDesigner from './components/CakeDesigner';
import Locations from './components/Locations';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutWizard from './components/CheckoutWizard';
import AdminProductos from './components/AdminProductos';
import { obtProductos } from './services/api';


export default function App() {
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const cargarProductos =
      async () => {

          try {

              const datos =
                  await obtProductos();

              setProducts(datos);

          } catch (error) {

              console.error(error);

          }
      };

      cargarProductos();

  }, []);

  return (
    <>
      {/* Barra de Navegación */}
      <Navbar 
        onCartToggle={() => setIsCartOpen(!isCartOpen)} 
      />

      {/* Sección Hero / Portada */}
      <Hero />

      {/* Línea decorativa */}
      <div className="deco-line"></div>

      {/* Sección Quiénes Somos / Pilares */}
      <AboutUs />

      {/* Catálogo de Productos */}
      <Catalog 
        products={products}
        onProductSelect={(product) => setSelectedProduct(product)} 
      />

      {/* Línea decorativa */}
      <div className="deco-line"></div>

      {/* Línea decorativa */}
      <div className="deco-line"></div>

      {/* Ubicaciones de Sucursales (Mapas) */}
      <Locations />

      {/* Testimonios y Reseñas de Clientes */}
      <Testimonials />

      {/* Formulario de Contacto y Footer */}
      <Footer />

      {/* Modal de Detalle de Producto */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* Carrito de Compras Lateral */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => setIsCheckoutOpen(true)} 
      />

      {/* Asistente de Checkout Paso a Paso */}
      {isCheckoutOpen && (
        <CheckoutWizard 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      )}
      {JSON.parse(localStorage.getItem('usuario'))?.rol === 'admin' && (
        <AdminProductos />
      )}
    </>
  );
}
