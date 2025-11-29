import { test, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';

test.describe('Concurrent Users Performance Tests', () => {
  test('two users should be able to view the same item details in less than 2 seconds each', async ({ browser }) => {
    // Crear dos contextos de navegador independientes (simulando dos usuarios diferentes)
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const startTime1 = Date.now();
    const startTime2 = Date.now();
    
    // Ambos usuarios acceden al mismo artículo simultáneamente
    await Promise.all([
      page1.goto(appUrls.item(1)),
      page2.goto(appUrls.item(1))
    ]);
    
    // Esperar a que ambas páginas estén completamente cargadas
    await Promise.all([
      page1.waitForLoadState('networkidle'),
      page2.waitForLoadState('networkidle')
    ]);
    
    const endTime1 = Date.now();
    const endTime2 = Date.now();
    
    const loadTime1 = endTime1 - startTime1;
    const loadTime2 = endTime2 - startTime2;
    
    console.log(`User 1 load time: ${loadTime1}ms`);
    console.log(`User 2 load time: ${loadTime2}ms`);
    
    // Verificar que ambos usuarios pueden ver la misma información
    const title1 = await page1.locator('h1').textContent();
    const title2 = await page2.locator('h1').textContent();
    
    expect(title1).toBe(title2);
    
    // Verificar que ambos cargaron en menos de 2 segundos
    expect(loadTime1).toBeLessThan(2000);
    expect(loadTime2).toBeLessThan(2000);
    
    // Limpiar
    await context1.close();
    await context2.close();
  });

  test('two users should be able to view different items concurrently in less than 2 seconds each', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const startTime = Date.now();
    
    // Usuario 1 ve artículo 1, Usuario 2 ve artículo 2
    await Promise.all([
      page1.goto(appUrls.item(1)),
      page2.goto(appUrls.item(2))
    ]);
    
    await Promise.all([
      page1.waitForLoadState('networkidle'),
      page2.waitForLoadState('networkidle')
    ]);
    
    const endTime = Date.now();
    const totalLoadTime = endTime - startTime;
    
    console.log(`Concurrent load time for both users: ${totalLoadTime}ms`);
    
    // Verificar que ambos tienen contenido cargado
    await expect(page1.locator('h1')).toBeVisible();
    await expect(page2.locator('h1')).toBeVisible();
    
    // Verificar que la carga concurrente fue rápida
    expect(totalLoadTime).toBeLessThan(2000);
    
    await context1.close();
    await context2.close();
  });
});
