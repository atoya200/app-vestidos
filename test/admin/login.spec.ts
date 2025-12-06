import { test, expect } from '@playwright/test';
import { testUsers } from '../testData/credentials';
import { appUrls } from '../testData/urls';

test('Login como administrador', async ({ page }) => {
    await page.goto(appUrls.home);
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(testUsers.admin.username);
    await page.getByRole('textbox', { name: 'Username' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(testUsers.admin.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await page.getByRole('heading', { name: 'Admin dashboard' }).click();
    await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
});


test('Login como administrador con credenciales incorrectas debe fallar', async ({ page }) => {
    await page.goto(appUrls.home);

    // Ir al login de admin
    await page.getByRole('link', { name: 'Admin' }).click();

    // Completar usuario incorrecto
    await page.getByRole('textbox', { name: 'Username' }).fill(testUsers.invalidAdmin.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(testUsers.invalidAdmin.password);

    // Intentar iniciar sesión
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Esperar mensaje de error o permanecer en la página de login
    await expect(
        page.getByText(/(Invalid username or password|Usuario o contraseña incorrectos)/i)
    ).toBeVisible();


    // Revisión de URL de la página, dado que si es exitoso lo lleva a otro lado
    await expect(page).toHaveURL(appUrls.adminLogin);

    // Revisión de el formulario de login sigue visible
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();
});



test('Cierre de sesión desde el dashboard', async ({ page }) => {
    await page.goto(appUrls.home);
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(testUsers.admin.username);
    await page.getByRole('textbox', { name: 'Username' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill(testUsers.admin.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    
    await page.getByRole('heading', { name: 'Admin dashboard' }).click();
    
    await expect(page.getByRole('heading', { name: 'Admin dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page.getByRole('heading', { name: 'Admin sign in' })).toBeVisible();

})