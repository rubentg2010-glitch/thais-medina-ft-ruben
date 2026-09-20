import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findProduct } from '../data/products';

const CartContext = createContext(null);
const STORAGE_KEY = 'thais-medina-shop-cart';

// Una línea de carrito se identifica por producto + talla (si aplica),
// para poder llevar la camiseta en dos tallas distintas por separado.
function lineKey(productId, size) {
  return size ? `${productId}__${size}` : productId;
}

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(readStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  function addItem(productId, size) {
    const key = lineKey(productId, size);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { key, productId, size: size ?? null, quantity: 1 }];
    });
    setIsOpen(true);
  }

  function updateQuantity(key, quantity) {
    setLines((prev) => {
      if (quantity <= 0) return prev.filter((l) => l.key !== key);
      return prev.map((l) => (l.key === key ? { ...l, quantity } : l));
    });
  }

  function removeItem(key) {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }

  function clearCart() {
    setLines([]);
  }

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const product = findProduct(line.productId);
          if (!product) return null;
          return { ...line, product };
        })
        .filter(Boolean),
    [lines]
  );

  const totalItems = items.reduce((sum, l) => sum + l.quantity, 0);
  const totalPrice = items.reduce((sum, l) => sum + l.quantity * l.product.price, 0);

  const value = {
    items,
    totalItems,
    totalPrice,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
