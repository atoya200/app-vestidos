import { test, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';
import { items } from '../testData/items';

test('Búsqueda de vestidos validos', async ({ page }) => {
    await page.goto(appUrls.search);

    for (const vestido of items.vestidosValidos) {
        await page.getByPlaceholder('Search…').fill(vestido);
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(page.getByText(vestido)).toBeVisible();
    }
});


test('No se encuentran vestidos invalidos', async ({ page }) => {
    await page.goto(appUrls.search);

    for (const vestido of items.vestidosInvalidos) {
        await page.getByPlaceholder('Search…').fill(vestido);
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(
            page.getByText(/(No items match your filters.|Artículos no encontrados según sus filtros.)/i)
        ).toBeVisible();
    }
});


test('Búsqueda de un artículo existente', async ({ page }) => {

  await page.goto(appUrls.search);
  
  const articuloBuscado = 'Silk Evening Gown';
  await page.getByPlaceholder('Search…').fill(articuloBuscado);
  await page.getByRole('button', { name: 'Search' }).click();
  
  await expect(page.getByText(articuloBuscado)).toBeVisible();
  await expect(page.getByText(/From \$\d+\/day/)).toBeVisible();
  await expect(page.getByRole('link', { name: /View details/i })).toBeVisible();
});


test('Búsqueda de un artículo no existente', async ({ page }) => {
  await page.goto(appUrls.search);
  
  const articuloInexistente = 'Vestido de fiesta largo rojo';
  await page.getByPlaceholder('Search…').fill(articuloInexistente);
  await page.getByRole('button', { name: 'Search' }).click();
  
  await expect(
    page.getByText(/No items match your filters/i)
  ).toBeVisible();
  
  await expect(page.getByRole('link', { name: /View details/i })).not.toBeVisible();
});


test('Filtrado de vestidos por color', async ({ page }) => {

  const coloresExistentes = ['black', 'champagne', 'burgundy', 'floral'];
  
  for (const color of coloresExistentes) {

    await page.goto(appUrls.search);
    
    await page.getByPlaceholder('Color').fill(color);
    await page.getByRole('button', { name: 'Search' }).click();
    
    const productos = page.locator('div.rounded-2xl.border');
    const cantidad = await productos.count();
    
    if (cantidad > 0) {
      for (let i = 0; i < cantidad; i++) {

        await productos.nth(i).getByRole('link', { name: /View details/i }).click();
        
        const textoColor = await page.locator('text=/Color:.*$/').textContent();
        expect(textoColor?.toLowerCase()).toContain(color.toLowerCase());
        
        await page.goto(appUrls.search);
        
        await page.getByPlaceholder('Color').fill(color);
        await page.getByRole('button', { name: 'Search' }).click();
      }
    }
  }
});


test('Filtrado de vestidos por talla', async ({ page }) => {

  const tallasAProbar = ['XS', 'S', 'M', 'L', 'XL'];
  
  for (const talla of tallasAProbar) {

    await page.goto(appUrls.search);
    
    await page.getByPlaceholder('Size').fill(talla);
    await page.getByRole('button', { name: 'Search' }).click();
    
    const productos = page.locator('div.rounded-2xl.border');
    const cantidad = await productos.count();
    
    if (cantidad > 0) {
      for (let i = 0; i < cantidad; i++) {
        const producto = productos.nth(i);
        const textoTallas = await producto.locator('text=/Sizes:.*$/').textContent();
        
        expect(textoTallas).toContain(talla);
      }
    }
  }
});


test('Filtrado por cada estilo disponible', async ({ page }) => {

    const estilosExistentes = ['evening', 'black-tie', 'daytime', 'cocktail'];
  
  for (const estilo of estilosExistentes) {
    await page.goto(appUrls.search);
    
    await page.getByPlaceholder('Style (e.g., cocktail)').fill(estilo);
    await page.getByRole('button', { name: 'Search' }).click();
    
    const productos = page.locator('div.rounded-2xl.border');
    const cantidad = await productos.count();
    
    if (cantidad > 0) {

        const hrefs: string[] = [];
      for (let i = 0; i < cantidad; i++) {
        const href = await productos.nth(i).getByRole('link', { name: /View details/i }).getAttribute('href');
        if (href) hrefs.push(href);
      }
      
      for (const href of hrefs) {
        await page.goto(`http://localhost:3000${href}`);
        
        const textoEstilo = await page.locator('text=/Style:.*$/').textContent();
        expect(textoEstilo?.toLowerCase()).toContain(estilo.toLowerCase());
      }
    }
  }
});


function tieneCaracteresEspeciales(texto: string): boolean {
  const regex = /[^a-zA-Z0-9\s]/;
  return regex.test(texto);
}

test('Búsqueda con caracteres especiales', async ({ page }) => {
  
  const ejemplosBusqueda = [
    'zapatos:',           
    'dress!',
    'precio$100',
    'vestido@especial',
    'cualquier#cosa',
  ];
  
  for (const busqueda of ejemplosBusqueda) {
    await page.goto(appUrls.search);
    
    await page.getByPlaceholder('Search…').fill(busqueda);
    await page.getByRole('button', { name: 'Search' }).click();
    
    if (tieneCaracteresEspeciales(busqueda)) {

        await expect(page.getByText(/No items match your filters/i)).toBeVisible();
      
      const productos = page.locator('div.rounded-2xl.border');
      await expect(productos).toHaveCount(0);
    } else {

      await expect(page.locator('h1')).toContainText('Browse catalog');
    }
  }
});





