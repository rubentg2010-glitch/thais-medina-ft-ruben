import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const [active, setActive] = useState('todos');
  const [openProduct, setOpenProduct] = useState(null);

  const visible = active === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <section className="wrap" id="tienda">
      <div className="section-intro">
        <h2>La colección</h2>
        <p>
          Piezas pensadas para llevar en el bolsillo, en la mochila o puestas: el mismo
          símbolo que Thais lleva al escenario.
        </p>
      </div>

      <nav className="category-nav" aria-label="Categorías">
        <button
          className={`category-nav__btn${active === 'todos' ? ' is-active' : ''}`}
          onClick={() => setActive('todos')}
        >
          Todos
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`category-nav__btn${active === c.id ? ' is-active' : ''}`}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={setOpenProduct} />
        ))}
      </div>

      {openProduct && (
        <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      )}
    </section>
  );
}
