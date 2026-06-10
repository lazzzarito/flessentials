"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { lockBodyScroll } from "@/lib/scroll-lock";

const PAYMENT_OPTIONS = ["Efectivo USD", "Efectivo CUP", "Transferencia USD", "Transferencia CUP", "Zelle", "PayPal", "Otro"];

export default function Cart({ cartItems, onUpdateQty, onRemoveItem, onClearCart, storeConfig }) {
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState({ name: "", phone: "", delivery: "pickup", address: "", payment: "", paymentOther: "" });

  useEffect(() => {
    if (isOpen) {
      return lockBodyScroll();
    }
  }, [isOpen]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalUSD = cartItems.reduce((acc, item) => acc + item.priceUSD * item.quantity, 0);

  const update = (field, value) => setCustomer((prev) => ({ ...prev, [field]: value }));

  const getWhatsAppLink = () => {
    const number = storeConfig.whatsappNumber.replace(/[^0-9+]/g, "");

    let message = `🛒 *Nuevo Pedido - ${storeConfig.name}*\n`;
    message += `──────────────────────────\n\n`;

    if (customer.name) message += `👤 *Cliente:* ${customer.name}\n`;
    if (customer.phone) message += `📞 *Teléfono:* ${customer.phone}\n`;

    if (customer.delivery === "delivery") {
      message += `📍 *Envío:* A domicilio\n`;
      if (customer.address) message += `   *Dirección:* ${customer.address}\n`;
    } else {
      message += `📍 *Recogida:* En tienda\n`;
      message += `   *Dirección:* ${storeConfig.location}\n`;
    }

    if (customer.payment) message += `💳 *Pago:* ${customer.payment}${customer.paymentOther ? ` (${customer.paymentOther})` : ""}\n`;

    message += `\n──────────────────────────\n`;
    message += `*Productos:*\n`;

    cartItems.forEach((item) => {
      const itemUSD = (item.priceUSD * item.quantity).toFixed(2);
      message += `• *${item.quantity}x* ${item.name}\n`;
      if (item.attributes && Object.keys(item.attributes).length > 0) {
        const attrStr = Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ");
        message += `  _${attrStr}_\n`;
      }
      message += `  $${item.priceUSD.toFixed(2)} USD → *$${itemUSD} USD*\n\n`;
    });

    message += `──────────────────────────\n`;
    message += `*Total:* $${totalUSD.toFixed(2)} USD\n\n`;
    message += `Muchas gracias. ¡Espero su confirmación!`;

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  // Only enable confirm if essential fields are filled
  const canConfirm = customer.name && customer.phone && customer.payment && (customer.delivery === "pickup" || customer.delivery === "delivery");

  return (
    <>
      <button className="floating-cart-btn" onClick={() => setIsOpen(true)}>
        <span>🛒 Mi Carrito</span>
        {totalItems > 0 && <span className="cart-count-badge">{totalItems}</span>}
      </button>

      <div className={`cart-overlay ${isOpen ? "open" : ""}`} onClick={() => setIsOpen(false)} />

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Tu Carrito</h2>
          <button className="btn-close-cart" onClick={() => setIsOpen(false)}>&times;</button>
        </div>

        <div className="cart-items-container">
          {cartItems.length === 0 ? (
            <div className="cart-empty-message">
              <span style={{ fontSize: "3rem" }}>🛍️</span>
              <p>Tu carrito está vacío.</p>
              <button className="category-btn" onClick={() => setIsOpen(false)} style={{ background: "var(--border-color)", color: "var(--text-primary)" }}>
                Volver a la tienda
              </button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <Image src={item.image} alt={item.name} width={60} height={60} className="cart-item-image" />
                  <div className="cart-item-details">
                    <span className="cart-item-title">{item.name}</span>
                    <span className="cart-item-price">${item.priceUSD.toFixed(2)} USD</span>
                    <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
                      <div className="cart-item-qty-controls">
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity - 1)}>-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button className="btn-remove-item" onClick={() => onRemoveItem(item.id)} title="Eliminar producto">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Checkout Form */}
              <div className="cart-checkout-form">
                <h3 className="cart-checkout-title">Datos del pedido</h3>

                <div className="checkout-field">
                  <label className="checkout-label">Nombre *</label>
                  <input className="checkout-input" type="text" placeholder="Tu nombre" value={customer.name} onChange={(e) => update("name", e.target.value)} />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Teléfono *</label>
                  <input className="checkout-input" type="tel" placeholder="+53 5XXXXXXX" value={customer.phone} onChange={(e) => update("phone", e.target.value)} />
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Recogida / Envío *</label>
                  <div className="checkout-radio-group">
                    <label className={`checkout-radio ${customer.delivery === "pickup" ? "active" : ""}`}>
                      <input type="radio" name="delivery" value="pickup" checked={customer.delivery === "pickup"} onChange={(e) => update("delivery", e.target.value)} />
                      Recoger en tienda
                    </label>
                    <label className={`checkout-radio ${customer.delivery === "delivery" ? "active" : ""}`}>
                      <input type="radio" name="delivery" value="delivery" checked={customer.delivery === "delivery"} onChange={(e) => update("delivery", e.target.value)} />
                      Envío a domicilio
                    </label>
                  </div>
                  {customer.delivery === "delivery" ? (
                    <input className="checkout-input" type="text" placeholder="Dirección de envío" value={customer.address} onChange={(e) => update("address", e.target.value)} />
                  ) : (
                    <p className="checkout-store-address">📍 {storeConfig.location}</p>
                  )}
                </div>

                <div className="checkout-field">
                  <label className="checkout-label">Método de pago *</label>
                  <div className="checkout-payment-grid">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label key={opt} className={`checkout-payment-chip ${customer.payment === opt ? "active" : ""}`}>
                        <input type="radio" name="payment" value={opt} checked={customer.payment === opt} onChange={(e) => update("payment", e.target.value)} />
                        {opt}
                      </label>
                    ))}
                  </div>
                  {customer.payment === "Otro" && (
                    <input className="checkout-input" type="text" placeholder="Especifica el método" value={customer.paymentOther} onChange={(e) => update("paymentOther", e.target.value)} style={{ marginTop: "0.5rem" }} />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-row">
              <span className="cart-total-label">Total:</span>
              <div className="cart-total-values">
                <span className="cart-total-primary">${totalUSD.toFixed(2)} USD</span>
              </div>
            </div>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-checkout ${!canConfirm ? "btn-disabled" : ""}`}
              onClick={(e) => {
                if (!canConfirm) { e.preventDefault(); return; }
                setTimeout(() => onClearCart(), 500);
              }}
              style={!canConfirm ? { opacity: 0.5, pointerEvents: "none" } : {}}
            >
              Confirmar pedido por WhatsApp
            </a>
          </div>
        )}
      </div>

      <style jsx global>{`
        .cart-checkout-form {
          padding: 1.5rem 0 0.5rem;
          border-top: 1px solid var(--border-color);
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-checkout-title {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .checkout-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .checkout-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .checkout-input {
          padding: 0.6rem 0.85rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
        }

        .checkout-radio-group {
          display: flex;
          gap: 0.5rem;
        }

        .checkout-radio {
          flex: 1;
          padding: 0.6rem 0.85rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
        }

        .checkout-radio input { display: none; }

        .checkout-radio.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }

        .checkout-store-address {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding: 0.4rem 0;
        }

        .checkout-payment-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .checkout-payment-chip {
          padding: 0.4rem 0.75rem;
          border-radius: 15px;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkout-payment-chip input { display: none; }

        .checkout-payment-chip.active {
          background: var(--text-primary);
          color: var(--accent-light);
          border-color: var(--text-primary);
        }
      `}</style>
    </>
  );
}
