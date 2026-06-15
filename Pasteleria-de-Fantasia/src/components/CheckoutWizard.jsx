import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOCATIONS } from '../data/products';
import { registraPedido } from '../services/api';

export default function CheckoutWizard({ isOpen, onClose }) {
  const { cart, cartTotal, clearCart, getProductPrice } = useCart();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Estados del Formulario - Datos de entrega (Paso 1)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    deliveryMethod: 'pickup',
    locationId: '1',
    address: '',
    deliveryDate: '',
    deliveryTime: '09:00 - 12:00'
  });

  // Estados del Formulario - Datos de pago (Paso 2)
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'card', // 'card' o 'cash'
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  if (!isOpen) return null;

  const formatPrice = (value) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 0 }).format(value);
  };

  // Obtener fecha mínima permitida (hoy + 48 horas / 2 días)
  const getMinDateString = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 2); // 48 horas adelante
    const yyyy = minDate.getFullYear();
    const mm = String(minDate.getMonth() + 1).padStart(2, '0');
    const dd = String(minDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validar datos de despacho
  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'El nombre completo debe tener al menos 3 caracteres.';
    }
    if (!formData.phone.trim() || !/^\+?\d{7,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Introduce un teléfono de contacto válido (7 a 10 dígitos).';
    }
    if (formData.deliveryMethod === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'El domicilio de entrega es obligatorio.';
    }
    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'Selecciona la fecha para la entrega.';
    } else {
      const selected = new Date(formData.deliveryDate + 'T00:00:00');
      const limit = new Date();
      limit.setDate(limit.getDate() + 1); // 24-48 horas aprox.
      limit.setHours(0,0,0,0);
      if (selected < limit) {
        newErrors.deliveryDate = 'Debes reservar con al menos 48 horas de anticipación.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar datos de pago
  const validateStep2 = () => {
    const newErrors = {};
    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardName.trim()) {
        newErrors.cardName = 'El nombre del titular es obligatorio.';
      }
      if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos.';
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.cardExpiry)) {
        newErrors.cardExpiry = 'Usa el formato MM/AA.';
      }
      if (!/^\d{3}$/.test(paymentData.cardCvv)) {
        newErrors.cardCvv = 'El CVV debe tener 3 dígitos.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    }
  };

  const handleConfirmOrder = async () => {
    if (step === 2) {
      if (validateStep2()) {
        const orderBody = {
          fullName: formData.fullName,
          phone: formData.phone,
          deliveryMethod: formData.deliveryMethod,
          locationId: formData.locationId,
          address: formData.address,
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
          paymentMethod: paymentData.paymentMethod,
          total: cartTotal,
          items: cart
        };

        try {

            await registraPedido(
              orderBody
            );

            setStep(3);

          } catch (error) {

            console.error(error);

          }
      }
    }
  };

  const generarBoletaPDF = () => {
    const doc = new jsPDF();

    doc.setFont('courier', 'normal');

    doc.setFontSize(18);
    doc.setFont('courier', 'bold');
    doc.text('PASTELERÍA DE FANTASÍA', 105, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('courier', 'normal');
    doc.text('La Paz - Bolivia', 105, 28, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.setLineDashPattern([3, 3], 0);
    doc.line(14, 38, 196, 38);

    doc.setFontSize(11);
    doc.setFont('courier', 'bold');
    doc.text('Cliente:', 14, 55);
    doc.text('Teléfono:', 14, 65);
    doc.text('Entrega:', 14, 75);
    doc.text('Fecha/Hora:', 14, 85);
    doc.text('Pago:', 14, 95);

    doc.setFont('courier', 'normal');
    doc.text(formData.fullName, 42, 55);
    doc.text(formData.phone, 46, 65);

    const entrega =
      formData.deliveryMethod === 'pickup'
        ? `Retiro en Sucursal`
        : `Envío a domicilio`;

    doc.text(entrega, 42, 75);
    doc.text(`${formData.deliveryDate} (${formData.deliveryTime})`, 55, 85);
    doc.text(paymentData.paymentMethod === 'card' ? 'Tarjeta (Aprobado)' : 'Efectivo', 35, 95);

    doc.line(14, 110, 196, 110);

    let y = 125;

    cart.forEach((item) => {
      const subtotal = getProductPrice(item) * item.quantity;

      doc.setFont('courier', 'normal');
      doc.text(`${item.quantity}x ${item.product.name}`, 14, y);
      doc.text(formatPrice(subtotal), 196, y, { align: 'right' });

      doc.setFontSize(9);
      doc.text(
        item.isCustom
          ? `Personalizado`
          : `Port. ${item.selectedPortions}`,
        14,
        y + 7
      );

      doc.setFontSize(11);
      y += 20;
    });

    doc.line(14, y + 5, 196, y + 5);

    doc.setFontSize(16);
    doc.setFont('courier', 'bold');
    doc.text('TOTAL:', 14, y + 22);
    doc.text(formatPrice(cartTotal), 196, y + 22, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    doc.text(
      '* Guarda este recibo digital para el retiro de tus postres *',
      105,
      y + 45,
      { align: 'center' }
    );

    doc.save('boleta_compra.pdf');
  };

  const handleFinish = () => {
    clearCart();
    setStep(1);
    onClose();
  };

  return (
    <div 
      className="modal fade show d-block" 
      tabIndex="-1" 
      style={{ backgroundColor: 'rgba(74, 55, 40, 0.6)', backdropFilter: 'blur(6px)', zIndex: 1050 }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 overflow-hidden glass-card shadow-lg">
          {/* Header */}
          <div className="modal-header border-0 bg-transparent pt-4 px-4 pb-0 justify-content-between align-items-center">
            <h3 className="h5 text-brown-dark mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-bag-check-fill text-primary"></i> 
              {step === 3 ? '¡Pedido Confirmado!' : `Finalizar Compra - Paso ${step} de 2`}
            </h3>
            {step < 3 && (
              <button 
                type="button" 
                className="btn-close rounded-circle bg-light p-2 shadow-sm border border-secondary-subtle" 
                onClick={onClose} 
                aria-label="Cerrar"
              ></button>
            )}
          </div>

          <div className="modal-body p-4 p-md-5 pt-3">
            {/* PASO 1: DATOS DE ENTREGA */}
            {step === 1 && (
              <form className="text-start">
                <h4 className="h6 fw-bold mb-4 text-brown-dark border-bottom pb-2">Información del Destinatario y Fecha</h4>
                
                <div className="row g-3">
                  {/* Nombre */}
                  <div className="col-md-6">
                    <label htmlFor="fullName" className="form-label small fw-semibold text-brown-dark mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      className={`form-control border-secondary-subtle focus-ring ${errors.fullName ? 'is-invalid' : ''}`}
                      placeholder="Ej: Nicolás Valencia"
                      value={formData.fullName}
                      onChange={handleFormChange}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>

                  {/* Teléfono */}
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label small fw-semibold text-brown-dark mb-1">Teléfono Móvil</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      className={`form-control border-secondary-subtle focus-ring ${errors.phone ? 'is-invalid' : ''}`}
                      placeholder="Ej: 71234567"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  {/* Método de Entrega */}
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-brown-dark mb-1.5">Método de Despacho</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="deliveryMethod" 
                          id="methodPickup" 
                          value="pickup"
                          checked={formData.deliveryMethod === 'pickup'}
                          onChange={handleFormChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="methodPickup">
                          Retiro en Sucursal
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="radio" 
                          name="deliveryMethod" 
                          id="methodDelivery" 
                          value="delivery"
                          checked={formData.deliveryMethod === 'delivery'}
                          onChange={handleFormChange}
                        />
                        <label className="form-check-label text-muted" htmlFor="methodDelivery">
                          Envío a Domicilio
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Campo condicional según método */}
                  <div className="col-md-6">
                    {formData.deliveryMethod === 'pickup' ? (
                      <>
                        <label htmlFor="locationId" className="form-label small fw-semibold text-brown-dark mb-1">Seleccionar Sucursal</label>
                        <select 
                          id="locationId"
                          name="locationId"
                          className="form-select border-secondary-subtle focus-ring"
                          value={formData.locationId}
                          onChange={handleFormChange}
                        >
                          {LOCATIONS.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <label htmlFor="address" className="form-label small fw-semibold text-brown-dark mb-1">Dirección de Entrega</label>
                        <input 
                          type="text" 
                          id="address"
                          name="address"
                          className={`form-control border-secondary-subtle focus-ring ${errors.address ? 'is-invalid' : ''}`}
                          placeholder="Calle, Nro de puerta, Edificio/Dpto"
                          value={formData.address}
                          onChange={handleFormChange}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </>
                    )}
                  </div>

                  {/* Calendario de Entrega */}
                  <div className="col-md-6">
                    <label htmlFor="deliveryDate" className="form-label small fw-semibold text-brown-dark mb-1">Fecha de Entrega (Mín. 48h)</label>
                    <input 
                      type="date" 
                      id="deliveryDate"
                      name="deliveryDate"
                      min={getMinDateString()}
                      className={`form-control border-secondary-subtle focus-ring ${errors.deliveryDate ? 'is-invalid' : ''}`}
                      value={formData.deliveryDate}
                      onChange={handleFormChange}
                    />
                    {errors.deliveryDate && <div className="invalid-feedback">{errors.deliveryDate}</div>}
                  </div>

                  {/* Horario de Entrega */}
                  <div className="col-md-6">
                    <label htmlFor="deliveryTime" className="form-label small fw-semibold text-brown-dark mb-1">Rango Horario de Entrega</label>
                    <select 
                      id="deliveryTime"
                      name="deliveryTime"
                      className="form-select border-secondary-subtle focus-ring"
                      value={formData.deliveryTime}
                      onChange={handleFormChange}
                    >
                      <option value="09:00 - 12:00">Mañana (09:00 am - 12:00 pm)</option>
                      <option value="12:00 - 15:00">Mediodía (12:00 pm - 03:00 pm)</option>
                      <option value="15:00 - 18:00">Tarde (03:00 pm - 06:00 pm)</option>
                      <option value="18:00 - 20:00">Anochecer (06:00 pm - 08:00 pm)</option>
                    </select>
                  </div>
                </div>

                {/* Resumen del Monto */}
                <div className="mt-5 border-top pt-4 d-flex justify-content-between align-items-center">
                  <div>
                    <span className="text-muted small">Total de tu compra:</span>
                    <h5 className="fw-bold text-brown-dark mb-0">{formatPrice(cartTotal)}</h5>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-pasteleria-dark px-4"
                    onClick={handleNextStep}
                  >
                    Siguiente Paso <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </form>
            )}

            {/* PASO 2: SIMULACIÓN DE PAGO */}
            {step === 2 && (
              <form className="text-start">
                <h4 className="h6 fw-bold mb-4 text-brown-dark border-bottom pb-2">Selecciona tu Método de Pago</h4>

                {/* Métodos de Pago Radios */}
                <div className="d-flex gap-4 mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="paymentMethod" 
                      id="payCard" 
                      value="card"
                      checked={paymentData.paymentMethod === 'card'}
                      onChange={handlePaymentChange}
                    />
                    <label className="form-check-label fw-medium text-brown-dark" htmlFor="payCard">
                      <i className="bi bi-credit-card me-1"></i> Tarjeta de Crédito/Débito
                    </label>
                  </div>
                  {formData.deliveryMethod === 'delivery' && (
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="paymentMethod" 
                        id="payCash" 
                        value="cash"
                        checked={paymentData.paymentMethod === 'cash'}
                        onChange={handlePaymentChange}
                      />
                      <label className="form-check-label fw-medium text-brown-dark" htmlFor="payCash">
                        <i className="bi bi-cash-stack me-1"></i> Pago contra entrega (Efectivo)
                      </label>
                    </div>
                  )}
                </div>

                {/* Formulario de tarjeta condicional */}
                {paymentData.paymentMethod === 'card' ? (
                  <div className="row g-3 p-4 rounded-3 border bg-light shadow-inner mb-4">
                    {/* Tarjeta Visual Decorativa */}
                    <div className="col-12 d-flex justify-content-center mb-3">
                      <div 
                        className="rounded-3 p-3 text-white text-start shadow-sm position-relative overflow-hidden" 
                        style={{ 
                          width: '290px', 
                          height: '160px', 
                          background: 'linear-gradient(135deg, var(--color-brown-dark), var(--color-brown-light))' 
                        }}
                      >
                        <div className="fs-5 fw-bold mb-1">Fantasía Card</div>
                        <div className="small text-white-50">Mastercard / Visa Sim</div>
                        
                        {/* Chip ficticio */}
                        <div className="bg-warning rounded mt-3 mb-2" style={{ width: '32px', height: '22px', opacity: 0.7 }}></div>

                        <div className="fs-6 mb-2 tracking-widest font-monospace">
                          {paymentData.cardNumber 
                            ? paymentData.cardNumber.replace(/(\d{4})/g, '$1 ').trim() 
                            : '•••• •••• •••• ••••'}
                        </div>
                        <div className="d-flex justify-content-between align-items-center small mt-auto">
                          <span className="text-uppercase text-truncate" style={{ maxWidth: '180px' }}>
                            {paymentData.cardName || 'TITULAR DE LA TARJETA'}
                          </span>
                          <span className="font-monospace">{paymentData.cardExpiry || 'MM/AA'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Nombre en Tarjeta */}
                    <div className="col-md-6">
                      <label htmlFor="cardName" className="form-label small fw-semibold text-brown-dark mb-1">Nombre en la Tarjeta</label>
                      <input 
                        type="text" 
                        id="cardName"
                        name="cardName"
                        className={`form-control border-secondary-subtle focus-ring ${errors.cardName ? 'is-invalid' : ''}`}
                        placeholder="Ej: NICOLAS VALENCIA"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                      />
                      {errors.cardName && <div className="invalid-feedback">{errors.cardName}</div>}
                    </div>

                    {/* Número de Tarjeta */}
                    <div className="col-md-6">
                      <label htmlFor="cardNumber" className="form-label small fw-semibold text-brown-dark mb-1">Número de Tarjeta (16 dígitos)</label>
                      <input 
                        type="text" 
                        id="cardNumber"
                        name="cardNumber"
                        maxLength={16}
                        className={`form-control border-secondary-subtle focus-ring ${errors.cardNumber ? 'is-invalid' : ''}`}
                        placeholder="4000123456789010"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                      />
                      {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>

                    {/* Expiración */}
                    <div className="col-md-6">
                      <label htmlFor="cardExpiry" className="form-label small fw-semibold text-brown-dark mb-1">Vencimiento (MM/AA)</label>
                      <input 
                        type="text" 
                        id="cardExpiry"
                        name="cardExpiry"
                        maxLength={5}
                        className={`form-control border-secondary-subtle focus-ring ${errors.cardExpiry ? 'is-invalid' : ''}`}
                        placeholder="12/28"
                        value={paymentData.cardExpiry}
                        onChange={handlePaymentChange}
                      />
                      {errors.cardExpiry && <div className="invalid-feedback">{errors.cardExpiry}</div>}
                    </div>

                    {/* CVV */}
                    <div className="col-md-6">
                      <label htmlFor="cardCvv" className="form-label small fw-semibold text-brown-dark mb-1">Código de Seguridad (CVV)</label>
                      <input 
                        type="text" 
                        id="cardCvv"
                        name="cardCvv"
                        maxLength={3}
                        className={`form-control border-secondary-subtle focus-ring ${errors.cardCvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={paymentData.cardCvv}
                        onChange={handlePaymentChange}
                      />
                      {errors.cardCvv && <div className="invalid-feedback">{errors.cardCvv}</div>}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-3 border bg-success-subtle text-success border-success-subtle mb-4">
                    <i className="bi bi-info-circle-fill me-2 fs-5"></i>
                    Has seleccionado <strong>Pago contra entrega</strong>. Deberás abonar el monto exacto en efectivo o mediante código QR bancario al repartidor al momento de recibir tus postres.
                  </div>
                )}

                {/* Acciones */}
                <div className="d-flex align-items-center justify-content-between pt-4 border-top">
                  <button 
                    type="button" 
                    className="btn btn-pasteleria-outline px-4"
                    onClick={() => setStep(1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i> Volver a Despacho
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-pasteleria px-4"
                    onClick={handleConfirmOrder}
                  >
                    Confirmar Compra ({formatPrice(cartTotal)})
                  </button>
                </div>
              </form>
            )}

            {/* PASO 3: PANTALLA DE ÉXITO (RECIBO FACTURA) */}
            {step === 3 && (
              <div className="text-center success-pop py-4">
                {/* Gran Checkmark Animado */}
                <div 
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-4 animate-pulse"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-check-lg display-4"></i>
                </div>

                <h4 className="h3 text-brown-dark mb-2">¡Gracias por tu pedido, {formData.fullName}!</h4>
                <p className="text-muted mb-5">Tu orden ha sido agendada con éxito en el taller de repostería. A continuación, el detalle de tu boleta:</p>

                {/* Boleta de Compra / Recibo */}
                <div 
                  className="card text-start mx-auto p-4 border border-secondary-subtle rounded-3" 
                  style={{ maxWidth: '500px', backgroundColor: '#fffdf9', fontFamily: 'Courier New, monospace', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                >
                  <div className="text-center mb-3">
                    <h5 className="fw-bold text-dark mb-1">PASTELERÍA DE FANTASÍA</h5>
                    <span className="small text-muted">La Paz - Bolivia</span>
                    <div className="border-bottom border-secondary border-dashed my-3" style={{ borderStyle: 'dashed' }}></div>
                  </div>

                  {/* Datos de envío */}
                  <div className="small text-dark mb-3">
                    <p className="mb-1"><strong>Cliente:</strong> {formData.fullName}</p>
                    <p className="mb-1"><strong>Teléfono:</strong> {formData.phone}</p>
                    <p className="mb-1">
                      <strong>Entrega:</strong> {formData.deliveryMethod === 'pickup' 
                        ? `Retiro en Sucursal (${LOCATIONS.find(l => String(l.id) === String(formData.locationId))?.name})` 
                        : `Envío a domicilio (${formData.address})`}
                    </p>
                    <p className="mb-1"><strong>Fecha/Hora:</strong> {formData.deliveryDate} ({formData.deliveryTime})</p>
                    <p className="mb-0"><strong>Pago:</strong> {paymentData.paymentMethod === 'card' ? 'Tarjeta (Aprobado)' : 'Efectivo contra entrega'}</p>
                  </div>

                  <div className="border-bottom border-secondary border-dashed my-3" style={{ borderStyle: 'dashed' }}></div>

                  {/* Items */}
                  <div className="small text-dark mb-3">
                    {cart.map((item) => (
                      <div className="d-flex justify-content-between align-items-start mb-2" key={item.id}>
                        <div style={{ maxWidth: '75%' }}>
                          <span>{item.quantity}x {item.product.name}</span>
                          <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                            {item.isCustom 
                              ? `Bizcocho ${item.customDetails.sponge}, relleno ${item.customDetails.fillings.join('/')}` 
                              : `Port. ${item.selectedPortions}`}
                          </span>
                        </div>
                        <span>{formatPrice(getProductPrice(item) * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-bottom border-secondary border-dashed my-3" style={{ borderStyle: 'dashed' }}></div>

                  {/* Total */}
                  <div className="d-flex justify-content-between align-items-center fw-bold text-dark fs-5">
                    <span>TOTAL:</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>

                  <div className="text-center mt-4 text-muted small" style={{ fontSize: '0.7rem' }}>
                    * Guarda este recibo digital para el retiro de tus postres *
                  </div>
                </div>

                {/* Acciones de Cierre */}
                <div className="mt-5 d-flex justify-content-center gap-3">
                  <button 
                    type="button" 
                    className="btn btn-pasteleria-outline"
                    onClick={generarBoletaPDF}
                  >
                    <i className="bi bi-printer me-2"></i> Imprimir Recibo
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-pasteleria"
                    onClick={handleFinish}
                  >
                    Listo, Volver a la Tienda
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
