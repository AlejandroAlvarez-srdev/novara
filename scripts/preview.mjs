import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:3002', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (await page.getByRole('button', { name: 'Pausar escenas', exact: true }).count()) await page.getByRole('button', { name: 'Pausar escenas', exact: true }).click();
await page.screenshot({ path: 'artifacts/novara-desktop.png', animations: 'disabled' });
await page.locator('#experiencia').scrollIntoViewIfNeeded();
await expect(page.locator('.model-viewer')).toHaveAttribute('data-status', 'ready', { timeout: 20000 });
if (await page.getByRole('button', { name: 'Pausar giro', exact: true }).count()) await page.getByRole('button', { name: 'Pausar giro', exact: true }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: 'artifacts/novara-3d.png', animations: 'disabled' });
await page.getByRole('button', { name: 'Acabado Terracota' }).click();
await page.getByRole('slider', { name: 'Separar niveles de la maqueta' }).fill('75');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'artifacts/novara-3d-exploded.png', animations: 'disabled' });
await page.getByRole('button', { name: 'Acabado Arena' }).click();
await page.getByRole('button', { name: 'Restablecer vista' }).click();
for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
  await page.waitForTimeout(130);
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(100);
await page.screenshot({ path: 'artifacts/novara-desktop-full.png', fullPage: true, animations: 'disabled' });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:3002', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
if (await page.getByRole('button', { name: 'Pausar escenas', exact: true }).count()) await page.getByRole('button', { name: 'Pausar escenas', exact: true }).click();
await page.screenshot({ path: 'artifacts/novara-mobile.png', animations: 'disabled' });
await page.locator('#experiencia').scrollIntoViewIfNeeded();
await expect(page.locator('.model-viewer')).toHaveAttribute('data-status', 'ready', { timeout: 20000 });
await page.locator('.model-viewer').scrollIntoViewIfNeeded();
await page.screenshot({ path: 'artifacts/novara-3d-mobile.png', animations: 'disabled' });
for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
  await page.waitForTimeout(130);
}
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
await page.waitForTimeout(100);
await page.screenshot({ path: 'artifacts/novara-mobile-full.png', fullPage: true, animations: 'disabled' });
for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  const dimensions = await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth }));
  if (dimensions.documentWidth > width) throw new Error(`Horizontal overflow at ${width}px: ${dimensions.documentWidth}`);
}
console.log('Screenshots saved to artifacts/. No horizontal overflow at 7 viewport widths.');
await browser.close();
