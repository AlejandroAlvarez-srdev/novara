import { test, expect } from "@playwright/test";

test("hero scene controls select imagery and respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Reproducir escenas", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Ver escena Sentir" }).click();
  await expect(page.getByRole("button", { name: "Ver escena Sentir" })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".hero-frame.active img")).toHaveAttribute("src", /twilight-concept/);
  await page.getByRole("button", { name: "Ver escena Trascender" }).click();
  await expect(page.locator(".hero-frame.active img")).toHaveAttribute("src", /urban-concept/);
  await expect(page.locator(".hero-immersive")).not.toHaveClass(/is-playing/);
  await expect(page.getByRole("link", { name: /Vívelo en 3D/ })).toHaveAttribute("href", "#experiencia");
});

test("3D model renders, changes material, separates floors and supports rotation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#experiencia");
  const viewer = page.locator(".model-viewer");
  await viewer.scrollIntoViewIfNeeded();
  await expect(viewer).toHaveAttribute("data-status", "ready", { timeout: 20000 });
  const canvas = page.locator(".model-canvas");
  await expect(canvas).toHaveAttribute("data-finish", "arena");
  const natural = await canvas.screenshot();
  await page.getByRole("button", { name: "Acabado Terracota" }).click();
  await expect(canvas).toHaveAttribute("data-finish", "terracota");
  const warm = await canvas.screenshot();
  expect(warm.equals(natural)).toBe(false);
  await page.getByRole("slider", { name: "Separar niveles de la maqueta" }).fill("100");
  await expect(canvas).toHaveAttribute("data-separation", "1.00");
  const exploded = await canvas.screenshot();
  expect(exploded.equals(warm)).toBe(false);
  await canvas.focus();
  const original = await canvas.getAttribute("data-rotation");
  await canvas.press("ArrowRight");
  await expect(canvas).not.toHaveAttribute("data-rotation", original!);
  const rect = await canvas.boundingBox();
  const beforeDrag = await canvas.getAttribute("data-rotation");
  await page.mouse.move(rect!.x + rect!.width * .4, rect!.y + rect!.height * .5);
  await page.mouse.down();
  await page.mouse.move(rect!.x + rect!.width * .65, rect!.y + rect!.height * .5, { steps: 7 });
  await page.mouse.up();
  await expect(canvas).not.toHaveAttribute("data-rotation", beforeDrag!);
  await page.getByRole("button", { name: "Restablecer vista" }).click();
  await expect(canvas).toHaveAttribute("data-separation", "0.00");
  await expect(canvas).toHaveAttribute("data-rotation", "0.750");
  expect(errors).toEqual([]);
});

test("3D view provides an illustrated fallback when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", { value: function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (["webgl", "webgl2", "experimental-webgl"].includes(kind)) return null;
      return Reflect.apply(original, this, [kind, ...args]);
    } });
  });
  await page.goto("/#experiencia");
  await page.locator(".model-viewer").scrollIntoViewIfNeeded();
  await expect(page.locator(".model-viewer")).toHaveAttribute("data-status", "fallback", { timeout: 15000 });
  await expect(page.getByText("La vista 3D no está disponible en este dispositivo.", { exact: false })).toBeVisible();
  await expect(page.locator(".model-fallback img")).toBeVisible();
  await expect(page.getByRole("button", { name: "Acabado Arena" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Imaginemos tu próximo espacio" })).toBeVisible();
});

test("visual journey navigates by buttons and keyboard without overflowing the page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const track = page.getByRole("region", { name: "Recorrido visual por luz, materia y paisaje" });
  await track.scrollIntoViewIfNeeded();
  const previous = page.getByRole("button", { name: "Momento anterior" });
  const next = page.getByRole("button", { name: "Momento siguiente" });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect(page.locator(".journey-bottom > span:last-child")).toHaveText("02 03");
  await next.click();
  await expect(next).toBeDisabled();
  await expect(page.locator(".journey-bottom > span:last-child")).toHaveText("03 03");
  await track.focus();
  await track.press("ArrowLeft");
  await expect(page.locator(".journey-bottom > span:last-child")).toHaveText("02 03");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
