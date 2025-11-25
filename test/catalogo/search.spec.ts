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


