const { chromium } = require('playwright');
const path = require('path');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const viewports = [
    { name: 'mobile-se', width: 375, height: 667 },  // iPhone SE
    { name: 'mobile-12', width: 390, height: 844 },  // iPhone 12
    { name: 'tablet', width: 768, height: 1024 },    // iPad
    { name: 'desktop', width: 1280, height: 720 },   // Desktop
  ];

  const outputDir = path.join(__dirname, 'screenshots');

  for (const viewport of viewports) {
    console.log(`Taking screenshot for ${viewport.name} (${viewport.width}x${viewport.height})...`);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('http://localhost:3002');
    await page.waitForLoadState('networkidle');

    const screenshotPath = path.join(outputDir, `landing-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`  Saved to ${screenshotPath}`);
  }

  await browser.close();
  console.log('\nAll screenshots completed!');
}

takeScreenshots().catch(console.error);
