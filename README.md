# Thais Medina Shop

Tienda online de merchandising (llaveros, camisetas y papelería) con carrito y pago
real a través de Stripe Checkout. Hecha con React + Vite y una función serverless
de Netlify.

## 1. Probar en local

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. El botón "Ir a pagar" no funcionará en local a
menos que ejecutes también las funciones de Netlify con:

```bash
npm install -g netlify-cli   # solo la primera vez
netlify dev
```

## 2. Configurar Stripe

1. Crea una cuenta en [stripe.com](https://stripe.com) si no tienes una.
2. En el panel de Stripe, ve a **Desarrolladores > Claves de API** y copia la
   **clave secreta** (empieza por `sk_test_...` mientras pruebas, `sk_live_...`
   cuando actives cobros reales).
3. Guárdala como variable de entorno `STRIPE_SECRET_KEY` (ver abajo).

No hace falta crear productos en el panel de Stripe: los precios se generan al
vuelo a partir de `src/data/products.js`, así que solo tienes que editar ese
archivo para cambiar precios o añadir artículos nuevos.

## 3. Publicar en Netlify

1. Sube esta carpeta a un repositorio de GitHub (o arrastra la carpeta
   directamente a [app.netlify.com/drop](https://app.netlify.com/drop) para una
   primera prueba rápida).
2. En Netlify: **Add new site > Import an existing project**, conecta el
   repositorio. Netlify detectará `netlify.toml` automáticamente (build
   `npm run build`, carpeta `dist`, funciones en `netlify/functions`).
3. Ve a **Site configuration > Environment variables** y añade:
   - `STRIPE_SECRET_KEY` → tu clave secreta de Stripe.
   - `SITE_URL` → la URL que te dé Netlify, por ejemplo
     `https://thaismedinashop.netlify.app` (o tu dominio propio si conectas uno).
4. Vuelve a desplegar el sitio para que tome las variables nuevas
   (**Deploys > Trigger deploy**).

## 4. Cambiar precios, textos o productos

Todo el catálogo vive en un único archivo:

```
src/data/products.js
```

Cada producto tiene `name`, `price`, `image` y `description`. Las camisetas
además tienen `sizes`. Cambia el número de `price` y tanto la web como el cobro
de Stripe se actualizan a la vez — no hay que tocar nada más.

## 5. Envíos

Ahora mismo hay dos tarifas fijas configuradas en
`netlify/functions/create-checkout-session.js`:

- Península y Baleares: 3,95 €
- Canarias: 5,95 €

El cliente elige una de las dos en la pantalla de pago de Stripe. Puedes ajustar
los importes (en céntimos) o añadir envío gratis a partir de cierto importe
editando ese mismo archivo.

## 6. Imágenes de producto

Están en `public/images/`. Para cambiar una foto, sustituye el archivo
manteniendo el mismo nombre, o cambia la ruta en `src/data/products.js`.

## Estructura del proyecto

```
├── index.html
├── netlify.toml
├── netlify/functions/create-checkout-session.js   ← crea la sesión de pago
├── public/images/                                  ← fotos de producto
└── src/
    ├── data/products.js       ← catálogo (nombres, precios, fotos)
    ├── context/CartContext.jsx ← estado del carrito (persistido en el navegador)
    ├── components/             ← cabecera, hero, tarjetas de producto, carrito…
    └── App.jsx
```
