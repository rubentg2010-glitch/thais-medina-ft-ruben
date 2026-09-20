const HERO_PHOTOS = [
  '/images/live-1.jpg',
  '/images/live-2.jpg',
  '/images/live-3.jpg',
  '/images/live-4.jpg',
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__collage" aria-hidden="true">
        {HERO_PHOTOS.map((src, i) => (
          <div className={`hero__tile hero__tile--${i + 1}`} key={src}>
            <img src={src} alt="" />
          </div>
        ))}
      </div>

      <div className="hero__veil" aria-hidden="true" />

      <div className="wrap hero__content">
        <h1 className="hero__signature">Thais Medina</h1>
        <div className="hero__rule" />
        <p className="hero__tagline">De Canarias pal' mundo</p>
        <p className="hero__sub">
          Llaveros, camisetas y papelería oficial. Cada pieza lleva el corazón y el
          micrófono de siempre.
        </p>
        <a className="btn btn--primary btn--large hero__cta" href="#tienda">
          Ver la colección
        </a>
      </div>
    </section>
  );
}
