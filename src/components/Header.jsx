import { useCart } from '../context/CartContext';

export default function Header() {
  const { totalItems, openCart } = useCart();

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <a href="#top" className="wordmark">
          Thais Medina
        </a>
        <button className="cart-button" onClick={openCart} aria-label="Abrir carrito">
          Carrito
          {totalItems > 0 && <span className="cart-button__count">{totalItems}</span>}
        </button>
      </div>
    </header>
  );
}
