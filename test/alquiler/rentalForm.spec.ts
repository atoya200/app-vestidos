import { test, expect } from '@playwright/test';
import { testUsers } from '../testData/credentials';
import { appUrls } from '../testData/urls';
import { getAvailableSizesFromPage } from '../testData/sizes';

// Función helper para formatear fechas a YYYY-MM-DD
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Tests que deben ejecutarse en orden (primero crear, luego intentar reservar fechas ocupadas)
test.describe.serial('Rental flow - sequential tests', () => {
    // Variable para almacenar el talle usado en el primer test
    let usedSize: string;
    
    test('Realizar un alquiler exitoso', async ({ page }) => {
    // Calcular fechas dinámicas: 7 días desde hoy, rental de 5 días
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 7); // 7 días en el futuro
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5); // 5 días de alquiler
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Ir a la página de alquiler
    await page.goto(appUrls.item(1));
    
    // Obtener dinámicamente los talles disponibles
    const availableSizes = await getAvailableSizesFromPage(page, 1);
    if (availableSizes.length === 0) {
        throw new Error('No hay talles disponibles para el artículo 1');
    }
    usedSize = availableSizes[0]; // Guardar para usar en el siguiente test
    
    // Seleccionar el primer talle disponible
    await page.getByRole('button', { name: usedSize }).click();
    
    // Llenar el formulario con fechas dinámicas
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 123 456');
    await page.fill('input[name="start"]', startDateStr);
    await page.fill('input[name="end"]', endDateStr);

    await page.getByRole('button', { name: /request rental/i }).click();
    

    await expect(page.locator('text=Rental successfully completed')).toBeVisible({ timeout: 30000 });
});

test('Intentar alquilar fechas ya reservadas', async ({ page }) => {
    // Calcular las mismas fechas que el test anterior
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 4);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5);
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    // Ir a la página de alquiler del mismo artículo
    await page.goto(appUrls.item(1));
    
    // Seleccionar el mismo talle que se usó en el test anterior
    await page.getByRole('button', { name: usedSize }).click();
    
    // Intentar usar exactamente las mismas fechas del test anterior
    await page.fill('input[name="name"]', 'María González');
    await page.fill('input[name="email"]', 'maria@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 654 321');
    await page.fill('input[name="start"]', startDateStr);
    await page.fill('input[name="end"]', endDateStr);
    
    await page.getByRole('button', { name: /request rental/i }).click();
    
    await expect(page.locator('text=Item is already rented for the selected dates')).toBeVisible({ timeout: 10000 });
});

test('Intentar alquilar con fecha de inicio en el pasado', async ({ page }) => {
    const today = new Date();
    const pastStartDate = new Date(today);
    pastStartDate.setDate(today.getDate() - 5); // 5 días en el pasado
    
    const futureEndDate = new Date(today);
    futureEndDate.setDate(today.getDate() + 3); // 3 días en el futuro
    
    const pastStartStr = formatDate(pastStartDate);
    const futureEndStr = formatDate(futureEndDate);
    
    await page.goto(appUrls.item(1));
    
    // Obtener y seleccionar primer talle disponible
    const availableSizes = await getAvailableSizesFromPage(page, 1);
    await page.getByRole('button', { name: availableSizes[0] }).click();
    
    await page.fill('input[name="name"]', 'Pedro Martínez');
    await page.fill('input[name="email"]', 'pedro@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 333 444');
    await page.fill('input[name="start"]', pastStartStr);
    await page.fill('input[name="end"]', futureEndStr);
    
    await page.getByRole('button', { name: /request rental/i }).click();
    
    await expect(page.locator('text=You cannot select a start date in the past')).toBeVisible({ timeout: 10000 });
});

test('Intentar alquilar con ambas fechas en el pasado', async ({ page }) => {
    const today = new Date();
    const pastStartDate = new Date(today);
    pastStartDate.setDate(today.getDate() - 10); 
    
    const pastEndDate = new Date(today);
    pastEndDate.setDate(today.getDate() - 5);
    
    const pastStartStr = formatDate(pastStartDate);
    const pastEndStr = formatDate(pastEndDate);
    
    await page.goto(appUrls.item(1));
    
    const availableSizes = await getAvailableSizesFromPage(page, 1);
    await page.getByRole('button', { name: availableSizes[0] }).click();
    
    await page.fill('input[name="name"]', 'Ana López');
    await page.fill('input[name="email"]', 'ana@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 555 666');
    await page.fill('input[name="start"]', pastStartStr);
    await page.fill('input[name="end"]', pastEndStr);
    
    await page.getByRole('button', { name: /request rental/i }).click();
    
    await expect(page.locator('text=You cannot select a start date in the past')).toBeVisible({ timeout: 10000 });
});

test('Intentar alquilar con fecha de fin anterior a fecha de inicio', async ({ page }) => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 10); 
    
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 5); 
    
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    await page.goto(appUrls.item(1));
    
    // Obtener y seleccionar primer talle disponible
    const availableSizes = await getAvailableSizesFromPage(page, 1);
    await page.getByRole('button', { name: availableSizes[0] }).click();
    
    await page.fill('input[name="name"]', 'Luis Fernández');
    await page.fill('input[name="email"]', 'luis@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 777 888');
    await page.fill('input[name="start"]', startDateStr);
    await page.fill('input[name="end"]', endDateStr);
    
    await page.getByRole('button', { name: /request rental/i }).click();
    
    // Verificar mensaje de error para fecha de fin anterior a inicio
    await expect(page.locator('text=End date must be after start date')).toBeVisible({ timeout: 10000 });
});
});
