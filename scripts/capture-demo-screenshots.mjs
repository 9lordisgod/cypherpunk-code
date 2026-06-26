#!/usr/bin/env node
/**
 * Capture UI demo screenshots for the public repo.
 * Usage: node scripts/capture-demo-screenshots.mjs [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://localhost:3000";
const outDir = join(process.cwd(), "demo", "screenshots");

const pages = [
  { name: "01-homepage", path: "/", width: 1440, height: 900 },
  { name: "02-catalog", path: "/catalog", width: 1440, height: 900 },
  { name: "03-paths", path: "/paths", width: 1440, height: 900 },
  { name: "04-about", path: "/about", width: 1440, height: 900 },
  { name: "05-resource-detail", path: "/resource/cypherpunk-manifesto", width: 1440, height: 900 },
  { name: "06-mobile-home", path: "/", width: 390, height: 844 },
  { name: "07-mobile-catalog", path: "/catalog", width: 390, height: 844 },
];

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });

for (const page of pages) {
  const tab = await context.newPage();
  await tab.setViewportSize({ width: page.width, height: page.height });
  await tab.goto(`${baseUrl}${page.path}`, { waitUntil: "domcontentloaded", timeout: 30000 });
  await tab.waitForTimeout(800);
  await tab.screenshot({
    path: join(outDir, `${page.name}.png`),
    fullPage: page.width < 500,
  });
  await tab.close();
  console.log(`Captured ${page.name}.png`);
}

await browser.close();
console.log(`\nScreenshots saved to ${outDir}`);