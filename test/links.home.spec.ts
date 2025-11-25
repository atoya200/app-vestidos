import { test, expect } from '@playwright/test';
import { appUrls } from './testData/urls';



test('Existe página de conctacto', async ({ request }) => {
  const response = await request.get(appUrls.contact);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.contact} devolvió ${response.status()}`).not.toBe(404);
});


test('Existe página de privacidad', async ({ request }) => {
  const response = await request.get(appUrls.privacy);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.privacy} devolvió ${response.status()}`).not.toBe(404);
});



test('Existe página de términos y condiciones', async ({ request }) => {
  const response = await request.get(appUrls.terms);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.terms} devolvió ${response.status()}`).not.toBe(404);
});



test('Existe página de FAQ', async ({ request }) => {
  const response = await request.get(appUrls.terms);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.terms} devolvió ${response.status()}`).not.toBe(404);
});



test('Existe página de login', async ({ request }) => {
 const response = await request.get(appUrls.adminLogin);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.adminLogin} devolvió ${response.status()}`).not.toBe(404);
});


test('Existe página de catalogo', async ({ request }) => {
 const response = await request.get(appUrls.search);
  console.log(`Status code: ${response.status()}`);

  // Si la respuesta es 404, el test falla
  expect(response.status(), `La página ${appUrls.search} devolvió ${response.status()}`).not.toBe(404);
});
