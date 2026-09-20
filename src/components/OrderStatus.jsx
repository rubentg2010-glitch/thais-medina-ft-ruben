export default function OrderStatus({ status }) {
  const isSuccess = status === 'success';

  return (
    <section className="wrap" style={{ padding: '90px 0', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>
        {isSuccess ? '¡Pedido confirmado!' : 'Pago cancelado'}
      </h1>
      <p style={{ color: 'var(--ink-muted)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
        {isSuccess
          ? 'Gracias por tu compra. En breve recibirás un email de Stripe con la confirmación del pedido y el número de seguimiento cuando se envíe.'
          : 'No se ha completado ningún cargo. Puedes volver a la tienda y retomar tu carrito cuando quieras.'}
      </p>
      <a href="/" className="btn btn--primary" style={{ display: 'inline-block', marginTop: 24, textDecoration: 'none' }}>
        Volver a la tienda
      </a>
    </section>
  );
}
