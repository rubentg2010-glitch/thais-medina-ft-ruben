import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { getPrimaryImage } from '../data/products';

export default function CartDrawer() {
  const { isOpen, closeCart, items, totalPrice, updateQuantity, removeItem } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleCheckout() {
    setError(null);
    setIsRedirecting(true);
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((l) => ({
            productId: l.productId,
            size: l.size,
            quantity: l.quantity,
          })),
        }),
      });

      if (!response.ok) throw new Error('No se pudo iniciar el pago.');

      const data = await response.json();
      if (!data.url) throw new Error('Respuesta de pago inválida.');
      window.location.href = data.url;
    } catch (err) {
      setError('Algo falló al conectar con el pago. Inténtalo de nuevo en unos segundos.');
      setIsRedirecting(false);
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <aside className="cart-drawer" role="dialog" aria-label="Carrito de compra">
        <div className="cart-drawer__header">
          <div>
            <h2 className="cart-drawer__title">Tu cesta</h2>
            {items.length > 0 && (
              <p className="cart-drawer__count">
                {items.reduce((s, l) => s + l.quantity, 0)} artículo
                {items.reduce((s, l) => s + l.quantity, 0) === 1 ? '' : 's'}
              </p>
            )}
          </div>
          <button className="icon-btn" onClick={closeCart} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        <div className="cart-drawer__items">
          {items.length === 0 && (
            <div className="cart-empty">
              <p className="cart-empty__title">Tu cesta está vacía</p>
              <p>Echa un vistazo a la colección y encuentra tu pieza favorita.</p>
              <button className="btn btn--ghost" onClick={closeCart}>
                Ver la tienda
              </button>
            </div>
          )}

          {items.map((line) => (
            <div className="cart-line" key={line.key}>
              <div className="cart-line__thumb">
                <img src={getPrimaryImage(line.product)} alt={line.product.name} />
              </div>
              <div className="cart-line__info">
                <p className="cart-line__name">{line.product.name}</p>
                <p className="cart-line__meta">
                  {line.size ? `Talla ${line.size} · ` : ''}
                  {line.product.price.toFixed(2)} €
                </p>
                <div className="cart-line__controls">
                  <div className="qty-control">
                    <button onClick={() => updateQuantity(line.key, line.quantity - 1)} aria-label="Restar">
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button onClick={() => updateQuantity(line.key, line.quantity + 1)} aria-label="Sumar">
                      +
                    </button>
                  </div>
                  <button className="cart-line__remove" onClick={() => removeItem(line.key)}>
                    Quitar
                  </button>
                </div>
              </div>
              <span className="cart-line__subtotal">
                {(line.product.price * line.quantity).toFixed(2)} €
              </span>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Subtotal</span>
              <span className="cart-drawer__total-amount">{totalPrice.toFixed(2)} €</span>
            </div>
            <button
              className="btn btn--primary btn--full btn--large"
              onClick={handleCheckout}
              disabled={isRedirecting}
            >
              {isRedirecting ? 'Conectando con el pago…' : 'Ir a pagar'}
            </button>
            {error && (
              <p className="cart-note" style={{ color: 'var(--red-bright)' }}>
                {error}
              </p>
            )}
            <div className="cart-trust">
              <span>🔒 Pago seguro con Stripe</span>
              <span>Envío a Península, Baleares y Canarias</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
