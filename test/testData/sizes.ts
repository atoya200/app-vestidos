// Helper para obtener los talles disponibles de un artículo desde la UI
// Esto asegura que los tests usen talles realmente disponibles

export async function getAvailableSizesFromPage(page: any, itemId: number): Promise<string[]> {
  // Navegar a la página del artículo si no estamos ahí
  const currentUrl = page.url();
  if (!currentUrl.includes(`/items/${itemId}`)) {
    await page.goto(`http://localhost:3000/items/${itemId}`);
  }
  
  // Obtener todos los botones de talle
  const sizeButtons = await page.locator('h3:has-text("Available sizes:") + div button').allTextContents();
  return sizeButtons;
}

// Talle por defecto para usar en tests (primer talle disponible)
export async function getFirstAvailableSize(page: any, itemId: number): Promise<string> {
  const sizes = await getAvailableSizesFromPage(page, itemId);
  if (sizes.length === 0) {
    throw new Error(`No sizes available for item ${itemId}`);
  }
  return sizes[0];
}

// Verificar si un talle específico está disponible
export async function isSizeAvailable(page: any, itemId: number, size: string): Promise<boolean> {
  const sizes = await getAvailableSizesFromPage(page, itemId);
  return sizes.includes(size);
}
