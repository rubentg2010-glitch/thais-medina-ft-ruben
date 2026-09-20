import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOpen }) {
  const { addItem } = useCart();
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  const gallery = product.images ?? [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(hasSizes ? product.sizes[0] : null);

  return (
    <article className="product-card">
      <button
        className="product-card__image"
        onClick={() => onOpen(product)}
        aria-label={`Ver ${product.name}`}
      >
        <img src={gallery[activeImage]} alt={product.name} loading="lazy" />
        <span className="product-card__expand" aria-hidden="true">
          ⤢
        </span>
      </button>

      {gallery.length > 1 && (
        <div className="product-card__gallery" role="group" aria-label="Vistas del producto">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`gallery-thumb${activeImage === i ? ' is-selected' : ''}`}
              onClick={() => setActiveImage(i)}
              aria-label={product.imageLabels?.[i] ?? `Vista ${i + 1}`}
            >
              <img src={src} alt="" />
              {product.imageLabels && (
                <span className="gallery-thumb__label">{product.imageLabels[i]}</span>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="product-card__body">
        <h3 className="product-card__name">
          <button className="product-card__name-btn" onClick={() => onOpen(product)}>
            {product.name}
          </button>
        </h3>
        <p className="product-card__desc">{product.description}</p>

        {hasSizes && (
          <div className="product-card__sizes" role="group" aria-label="Talla">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-chip${size === s ? ' is-selected' : ''}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="product-card__footer">
          <span className="price">{product.price.toFixed(2)} €</span>
          <button className="btn btn--primary" onClick={() => addItem(product.id, size)}>
            Añadir a la cesta
          </button>
        </div>
      </div>
    </article>
  );
}
