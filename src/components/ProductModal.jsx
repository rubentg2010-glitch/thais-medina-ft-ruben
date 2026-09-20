import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart();
  const gallery = product.images ?? [product.image];
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(hasSizes ? product.sizes[0] : null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [justAdded, setJustAdded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function onKey(e) {
      if (e.key === 'Escape') {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isZoomed, onClose]);

  function handleImageClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setIsZoomed((z) => !z);
  }

  function handleAdd() {
    for (let i = 0; i < quantity; i++) addItem(product.id, size);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn modal-close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>

        <div className="product-modal__media">
          <div
            className={`product-modal__image${isZoomed ? ' is-zoomed' : ''}`}
            onClick={handleImageClick}
            role="button"
            aria-label={isZoomed ? 'Alejar imagen' : 'Ampliar imagen'}
            tabIndex={0}
          >
            <img
              ref={imgRef}
              src={gallery[activeImage]}
              alt={product.name}
              style={isZoomed ? { transformOrigin: zoomOrigin } : undefined}
            />
            {!isZoomed && <span className="zoom-hint">Toca para ampliar</span>}
          </div>

          {gallery.length > 1 && (
            <div className="product-modal__thumbs" role="group" aria-label="Vistas del producto">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={`gallery-thumb${activeImage === i ? ' is-selected' : ''}`}
                  onClick={() => {
                    setActiveImage(i);
                    setIsZoomed(false);
                  }}
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
        </div>

        <div className="product-modal__info">
          <h2 className="product-modal__name">{product.name}</h2>
          <p className="price price--large">{product.price.toFixed(2)} €</p>
          <p className="product-modal__desc">{product.description}</p>

          {hasSizes && (
            <div className="product-modal__field">
              <span className="field-label">Talla</span>
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
            </div>
          )}

          <div className="product-modal__field">
            <span className="field-label">Cantidad</span>
            <div className="qty-control qty-control--modal">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Restar">
                −
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} aria-label="Sumar">
                +
              </button>
            </div>
          </div>

          <button className="btn btn--primary btn--full btn--large" onClick={handleAdd}>
            {justAdded ? 'Añadido ✓' : 'Añadir a la cesta'}
          </button>
        </div>
      </div>
    </div>
  );
}
