import { test, expect } from '@playwright/test';
import { testUsers } from '../testData/credentials';
import { appUrls } from '../testData/urls';

// Función helper para formatear fechas a YYYY-MM-DD
const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

test('Crear un alquiler exitoso', async ({ page }) => {
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
    
    // Llenar el formulario con fechas dinámicas
    await page.fill('input[name="name"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan@gmail.com');
    await page.fill('input[name="phone"]', '+598 99 123 456');
    await page.fill('input[name="start"]', startDateStr);
    await page.fill('input[name="end"]', endDateStr);
    
    // Enviar el formulario
    await page.getByRole('button', { name: /request rental/i }).click();
    
    // Verificar que redirige con success=1 o que muestra mensaje de éxito
    await expect(page).toHaveURL(/success=1/, { timeout: 10000 });
});

