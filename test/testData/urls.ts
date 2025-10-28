export const appUrls = {
  home: process.env.BASE_URL || 'http://localhost:3000',
  adminLogin: (process.env.BASE_URL || 'http://localhost:3000') + '/admin/login',
  contact: (process.env.BASE_URL || 'http://localhost:3000') + '/contact',
  privacy: (process.env.BASE_URL || 'http://localhost:3000') + '/privacy',
  terms: (process.env.BASE_URL || 'http://localhost:3000') + '/terms',
  faq: (process.env.BASE_URL || 'http://localhost:3000') + '/faq',
  search: (process.env.BASE_URL || 'http://localhost:3000') + '/search',
};
