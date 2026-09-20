import { useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import OrderStatus from './components/OrderStatus';

function ShopPage() {
  return (
    <>
      <Header />
      <Hero />
      <ProductGrid />
      <Footer />
      <CartDrawer />
    </>
  );
}

function AppInner() {
  const { clearCart } = useCart();
  const [page, setPage] = useState('shop');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      clearCart();
      setPage('success');
    } else if (params.get('checkout') === 'cancel') {
      setPage('cancel');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (page === 'success') return <OrderStatus status="success" />;
  if (page === 'cancel') return <OrderStatus status="cancel" />;
  return <ShopPage />;
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  );
}
