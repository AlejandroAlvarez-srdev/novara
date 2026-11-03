import { test, expect } from "@playwright/test";

test("home renders without errors, missing images or horizontal overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(/Novara Grupo Constructor/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Construimoslo que imaginas.");
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator("main img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  expect(errors).toEqual([]);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
});

test("services expand and collapse with their content", async ({ page }) => {
  await page.goto("/#servicios");
  const plan = page.getByRole("button", { name: "02 Planificación" });
  await plan.click();
  await expect(plan).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Cada decisión, con una dirección.")).toBeVisible();
  await expect(page.getByText("Le damos forma a tu visión.")).toBeHidden();
  await plan.click();
  await expect(page.getByText("Cada decisión, con una dirección.")).toBeHidden();
});

test("filters open an accessible concept dialog and restore focus on escape", async ({ page }) => {
  await page.goto("/#vision");
  await page.getByRole("button", { name: "Interiores", exact: true }).click();
  await expect(page.locator(".concept-card")).toHaveCount(2);
  const card = page.getByRole("button", { name: "Explorar La esencia del espacio" });
  await card.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("No corresponde a una obra ejecutada por Novara");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(card).toBeFocused();
  await page.getByRole("button", { name: /Todos/ }).click();
  await expect(page.locator(".concept-card")).toHaveCount(6);
});

test("consultation validates, prepares the correct WhatsApp message and retains edits", async ({ page }) => {
  await page.goto("/#contacto");
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.locator(".contact-result")).toHaveCount(0);
  await page.getByLabel("Tu nombre", { exact: true }).fill("Cliente de prueba");
  await page.getByLabel("Correo electrónico").fill("cliente@example.com");
  await page.getByLabel("¿Qué tienes en mente?").selectOption("Diseño arquitectónico");
  await page.getByLabel("Cuéntanos un poco más").fill("Quiero diseñar una casa con luz natural en Duitama.");
  await page.getByRole("button", { name: "Preparar mi consulta" }).click();
  await expect(page.getByText("Aún no se ha enviado ningún mensaje.")).toBeVisible();
  const href = await page.getByRole("link", { name: "Continuar en WhatsApp" }).getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe("https://wa.me/573128188085");
  expect(url.searchParams.get("text")).toContain("Cliente de prueba");
  expect(url.searchParams.get("text")).toContain("Diseño arquitectónico");
  expect(url.searchParams.get("text")).toContain("casa con luz natural");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar" }).click();
  expect((await download).suggestedFilename()).toBe("mi-proyecto-novara.txt");
  await page.getByRole("button", { name: "Editar consulta" }).click();
  await expect(page.getByLabel("Tu nombre", { exact: true })).toHaveValue("Cliente de prueba");
  await expect(page.getByLabel("Cuéntanos un poco más")).toHaveValue("Quiero diseñar una casa con luz natural en Duitama.");
});

test("commercial links use the supplied company contact details", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /gerencia@novaraconstructora.com/ })).toHaveAttribute("href", "mailto:gerencia@novaraconstructora.com");
  for (const link of await page.locator('a[href*="wa.me"]').all()) await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/573128188085\?/);
  await expect(page.getByRole("link", { name: /ENCUÉNTRANOS EN DUITAMA/ })).toHaveAttribute("href", /CC\+Pasaje\+Solano\+Duitama\+Boyaca/);
});

test("mobile navigation supports escape and closes after selecting a section", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Navigation is always visible on desktop");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menú" });
  await toggle.click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation").getByRole("link", { name: "Servicios", exact: true }).click();
  await expect(page).toHaveURL(/#servicios$/);
  await expect(page.getByRole("navigation")).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
