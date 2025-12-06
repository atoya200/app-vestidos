const BASE = process.env.BASE_URL || 'http://localhost:3000';

export const appUrls = {
  home: BASE,
  adminLogin: BASE + '/admin/login',
  contact: BASE + '/contact',
  privacy: BASE + '/privacy',
  terms: BASE + '/terms',
  faq: BASE + '/faq',
  search: BASE + '/search',
  // Función para obtener la URL de un item específico
  item: (id: number) => `${BASE}/items/${id}`,
};
