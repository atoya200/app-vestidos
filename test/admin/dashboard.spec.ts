import { test, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';
import { testUsers } from '../testData/credentials';

test.describe('Dashboard - Inventory CRUD', () => {

    // Siempre se loguea antes de probar una funcionalidad del dashboard
    test.beforeEach(async ({ page }) => {
        await page.goto(appUrls.home);
        await page.getByRole('link', { name: 'Admin' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill(testUsers.admin.username);
        await page.getByRole('textbox', { name: 'Password' }).fill(testUsers.admin.password);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Esperar que aparezca el dashboard
        await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
    });

    // Crear elemento
    // Crear un nuevo vestido
    test('Agregar un nuevo vestido', async ({ page }) => {
        await page.getByRole('button', { name: /agregar vestido/i }).click();
        await page.getByRole('textbox', { name: /name/i }).fill('Golden Party Dress');
        await page.getByRole('textbox', { name: /category/i }).fill('dress');
        await page.getByRole('textbox', { name: /sizes/i }).fill('S, M');
        await page.getByRole('textbox', { name: /price\/day/i }).fill('89');
        await page.getByRole('button', { name: /guardar/i }).click();

        // Verificar que aparece en la lista
        await expect(page.getByText('Golden Party Dress')).toBeVisible();
    });

    // Modificar un vestido existente
    test('Editar un vestido existente', async ({ page }) => {
        // Buscar el "Floral Midi Dress" y editar
        await page.getByText('Floral Midi Dress').click();
        await page.getByRole('button', { name: /editar/i }).click();

        await page.getByRole('textbox', { name: /price\/day/i }).fill('55');
        await page.getByRole('button', { name: /guardar/i }).click();

        // Verificar que el cambio se haya aplicado
        await expect(page.getByText('$55')).toBeVisible();
    });

    // Eliminar un vestido existente
    test('Eliminar un vestido', async ({ page }) => {
        await page.getByText('Velvet Cocktail Dress').click();
        await page.getByRole('button', { name: /eliminar/i }).click();
        await page.getByRole('button', { name: /confirmar|sí/i }).click();

        // Verificar que ya no esté visible
        await expect(page.getByText('Velvet Cocktail Dress')).not.toBeVisible();
    });
});



/* 
    Faltaría implmentar uno de rentas, para ver si se refleja la reserva en el dashboard.
    Implicaría, como usuario no logueado reservar un vestido. 
    Luego ir al home o a la página de admin directamente
    Loguearse como un admin valido
    Ver que hay una nueva petición de renta, comparando con las que había antes.
*/