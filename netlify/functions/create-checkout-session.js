// Función serverless de Netlify: crea una sesión de Stripe Checkout.
//
// El precio de cada producto se saca SIEMPRE del catálogo del servidor
// (../../src/data/products.js), nunca de lo que mande el navegador.
// Así nadie puede manipular el precio desde el cliente.

import Stripe from 'stripe';
import { findProduct, getPrimaryImage } from '../../src/data/products.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Falta configurar STRIPE_SECRET_KEY en las variables de entorno de Netlify.',
      }),
    };
  }

  try {
    const { items } = JSON.parse(event.body || '{}');

    if (!Array.isArray(items) || items.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'El carrito está vacío.' }) };
    }

    const line_items = items.map(({ productId, size, quantity }) => {
      const product = findProduct(productId);
      if (!product) throw new Error(`Producto desconocido: ${productId}`);

      const safeQuantity = Math.max(1, Math.min(10, Number(quantity) || 1));
      const nameWithSize = size ? `${product.name} (Talla ${size})` : product.name;

      return {
        quantity: safeQuantity,
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(product.price * 100),
          product_data: {
            name: nameWithSize,
            images: [`${SITE_URL}${getPrimaryImage(product)}`],
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      shipping_address_collection: {
        allowed_countries: ['ES'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 395, currency: 'eur' },
            display_name: 'Envío Península y Baleares',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 595, currency: 'eur' },
            display_name: 'Envío Canarias',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 4 },
              maximum: { unit: 'business_day', value: 8 },
            },
          },
        },
      ],
      success_url: `${SITE_URL}/?checkout=success`,
      cancel_url: `${SITE_URL}/?checkout=cancel`,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
