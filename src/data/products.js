// Catálogo único de productos.
// IMPORTANTE: este archivo lo usan tanto la tienda (frontend) como la función
// de Stripe (netlify/functions/create-checkout-session.js), para que el precio
// que ve el cliente y el precio que se cobra sean siempre el mismo.
//
// Para cambiar precios, nombres o añadir productos, edita solo este archivo.
// El precio va en euros (con decimales), se convierte a céntimos automáticamente.

export const CATEGORIES = [
  { id: 'llaveros', label: 'Llaveros' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'sudaderas', label: 'Sudaderas' },
  { id: 'papeleria', label: 'Papelería' },
];

export const PRODUCTS = [
  {
    id: 'llavero-loca',
    category: 'llaveros',
    name: 'Llavero LOCA',
    price: 5.0,
    image: '/images/llavero-loca.jpg',
    description:
      'Llavero metálico con el arte de "LOCA": trompeta, congas y neón de fiesta canaria.',
  },
  {
    id: 'llavero-no-te-olvide',
    category: 'llaveros',
    name: 'Llavero "I Didn\'t Forget You"',
    price: 5.0,
    image: '/images/llavero-no-te-olvide.jpg',
    description: 'Atardecer en la orilla, para quien no olvida.',
  },
  {
    id: 'llavero-algo-trama',
    category: 'llaveros',
    name: 'Llavero Algo Trama',
    price: 5.0,
    image: '/images/llavero-algo-trama.jpg',
    description: 'Portada de "Algo Trama" en un llavero de acero inoxidable.',
  },
  {
    id: 'llavero-corazon-microfono',
    category: 'llaveros',
    name: 'Llavero Corazón & Micrófono',
    price: 5.0,
    image: '/images/llavero-corazon-microfono.jpg',
    description: 'El símbolo de Thais Medina: un corazón atravesado por un micrófono.',
  },
  {
    id: 'boligrafo-corazon-microfono',
    category: 'papeleria',
    name: 'Bolígrafo Corazón & Micrófono',
    price: 5.0,
    image: '/images/boligrafo-corazon-microfono.jpg',
    description: 'Bolígrafo negro con el símbolo de corazón y micrófono.',
  },
  {
    id: 'camiseta-thais-medina',
    category: 'camisetas',
    name: 'Camiseta Thais Medina',
    price: 20.0,
    images: ['/images/camiseta-frontal.jpg', '/images/camiseta-espalda.jpg'],
    imageLabels: ['Frontal', 'Espalda'],
    description:
      'Camiseta oversize negra: corazón y micrófono al pecho, estampado completo "De Canarias pal\' mundo" en la espalda.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'sudadera-thais-medina',
    category: 'sudaderas',
    name: 'Sudadera Thais Medina',
    price: 25.0,
    image: '/images/sudadera-corazon-microfono.jpg',
    description:
      'Sudadera negra con capucha y bolsillo canguro, con el corazón y el micrófono bordado al pecho.',
    sizes: ['S', 'M', 'L', 'XL'],
  },
];

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getPrimaryImage(product) {
  return product.images ? product.images[0] : product.image;
}
