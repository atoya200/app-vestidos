import { test, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';
import { getAvailableSizesFromPage } from '../testData/sizes';

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function toLocaleDateString(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

test.describe('El calendario muestra las fechas reservadas', () => {
    test('El calendario muestra correctamente las fechas ocupadas según la API', async ({ page }) => {
        // Ir a la página del artículo
        await page.goto(appUrls.item(1));
        
        // Obtener el talle que está seleccionado por defecto (primer talle disponible)
        const availableSizes = await getAvailableSizesFromPage(page, 1);
        const selectedSize = availableSizes[0]; // El primer talle se selecciona automáticamente
        
        // Obtener las fechas ocupadas de la API para ese talle específico
        const response = await page.request.get(`/api/items/1/availability?size=${selectedSize}`);
        const data = await response.json();
        const rentals = data.rentals || [];
        
        // Verificar que el calendario está presente
        const calendar = page.locator('.grid.grid-cols-7.gap-2');
        await expect(calendar).toBeVisible();
        
        // Generar los próximos 30 días
        const today = new Date();
        const next30Days = Array.from({ length: 30 }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            return d;
        });
        
        // Para cada día, verificar si debe estar marcado como ocupado
        for (const date of next30Days) {
            const dateISO = formatDate(date);
            const dateLabel = toLocaleDateString(date);
            
            // Verificar si este día está en algún rango de alquiler
            const isBooked = rentals.some((rental: { start: string; end: string }) => {
                return rental.start <= dateISO && dateISO <= rental.end;
            });
            
            // Buscar la celda del calendario para esta fecha (div dentro del grid)
            const cell = calendar.locator('div', { hasText: dateLabel }).first();
            
            if (isBooked) {
                // Debe tener la clase bg-rose y mostrar "Booked"
                const cellClass = await cell.getAttribute('class');
                expect(cellClass).toContain('bg-rose');
                await expect(cell.locator('text=Booked')).toBeVisible();
            } else {
                // No debe tener la clase bg-rose
                const cellClass = await cell.getAttribute('class');
                expect(cellClass).not.toContain('bg-rose');
            }
        }
    });
    
    test('El calendario muestra 30 días desde hoy', async ({ page }) => {
        await page.goto(appUrls.item(1));
        
        const calendar = page.locator('.grid.grid-cols-7.gap-2');
        await expect(calendar).toBeVisible();
        
        // Contar los días mostrados en el calendario
        const dayElements = await calendar.locator('> div').count();
        expect(dayElements).toBe(30);
    });
});
