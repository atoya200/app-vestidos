import { test, expect } from '@playwright/test';
import { appUrls } from '../testData/urls';

test.describe('Performance Tests', () => {
  test('home page should load in less than 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(appUrls.home);
    
    await page.waitForLoadState('networkidle');
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    expect(loadTime).toBeLessThan(2000);
  });
});
