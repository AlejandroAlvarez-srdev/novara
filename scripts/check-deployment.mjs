import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const target = new URL(process.argv[2]);
if (target.protocol !== 'https:' || !target.hostname.endsWith('.vercel.app')) throw new Error('Provide the HTTPS Vercel production URL.');
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch();
const errors = [];
const checks = [];
try {
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
    const response = await page.goto(target.href, { waitUntil: 'networkidle', timeout: 60000 });
    if (response?.status() !== 200) throw new Error(`Home returned ${response?.status()}`);
    await expect(page).toHaveTitle(/Novara Grupo Constructor/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Construimos');
    const socialImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    if (!socialImage || new URL(socialImage).protocol !== 'https:' || socialImage.includes('localhost')) throw new Error('Invalid production social image URL.');
    const imageResponse = await page.request.get(socialImage);
    if (imageResponse.status() !== 200 || !imageResponse.headers()['content-type']?.startsWith('image/')) throw new Error('Social image did not load.');
    await page.getByRole('button', { name: 'Ver escena Sentir' }).click();
    await expect(page.locator('.hero-frame.active img')).toHaveAttribute('src', /twilight-concept/);
    await page.screenshot({ path: `artifacts/deployed-${name}.png`, animations: 'disabled' });
    await page.locator('#experiencia').scrollIntoViewIfNeeded();
    await expect(page.locator('.model-viewer')).toHaveAttribute('data-status', 'ready', { timeout: 30000 });
    await page.getByRole('button', { name: 'Acabado Oliva' }).click();
    await expect(page.locator('.model-canvas')).toHaveAttribute('data-finish', 'oliva');
    await page.locator('.model-viewer').screenshot({ path: `artifacts/deployed-3d-${name}.png` });
    await page.locator('#vision').scrollIntoViewIfNeeded();
    await expect(page.locator('.concept-card')).toHaveCount(6);
    await page.getByRole('button', { name: 'Interiores', exact: true }).click();
    await expect(page.locator('.concept-card')).toHaveCount(2);
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await expect(page.locator('a[href="mailto:gerencia@novaraconstructora.com"]')).toBeVisible();
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) throw new Error(`${name}: horizontal overflow`);
    checks.push({ viewport: name, home: 200, socialImage: 200, hero: 'ok', model3d: 'ok', gallery: 'ok', contact: 'ok', overflow: false });
    await page.close();
  }
  if (errors.length) throw new Error(errors.join('\n'));
  const result = { url: target.origin, checkedAt: new Date().toISOString(), checks, errors };
  await writeFile('artifacts/deployment-check.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
