const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  const url = 'file:///' + path.resolve('dist/index.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(3500);

  const dom = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    const duplicates = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    const unlabeledButtons = [...document.querySelectorAll('button')].filter(el =>
      !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.textContent.trim())
    ).length;
    const imagesMissingAlt = [...document.images].filter(img => !img.hasAttribute('alt')).length;
    const imagesLoaded = [...document.images].filter(img => img.complete && img.naturalWidth > 0).length;
    const resources = performance.getEntriesByType('resource').map(r => r.name.split(/[\\/]/).pop().split('?')[0]);
    return {
      duplicates,
      unlabeledButtons,
      imagesMissingAlt,
      imageCount: document.images.length,
      imagesLoaded,
      resourceCount: resources.length,
      storyBodiesLoadedInitially: resources.filter(name => /^story-\d{2}\.js$/.test(name)).length,
      initialStoryImagesLoaded: [...document.images].filter(img => /story-/.test(img.src) && img.complete && img.naturalWidth > 0).length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    };
  });

  await page.locator('#storiesSplide article').first().click();
  await page.waitForSelector('#articleModal.flex');
  await page.waitForSelector('#modalContent h3');
  const article = await page.evaluate(() => ({
    storyBodiesLoaded: performance.getEntriesByType('resource').filter(r => /story-\d{2}\.js(?:\?|$)/.test(r.name)).length,
    modalScrollTop: document.getElementById('articleModalBody').scrollTop,
    role: document.getElementById('articleModal').getAttribute('role'),
    ariaModal: document.getElementById('articleModal').getAttribute('aria-modal'),
    activeLabel: document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent?.trim().slice(0, 60)
  }));
  await page.keyboard.press('Escape');
  await page.locator('#storiesToggle').click();
  await page.waitForSelector('#storiesLibraryModal.flex');
  const library = await page.evaluate(() => ({
    cards: document.querySelectorAll('#storiesLibraryGrid article').length,
    bodyStoryScripts: performance.getEntriesByType('resource').filter(r => /story-\d{2}\.js(?:\?|$)/.test(r.name)).length,
    activeId: document.activeElement?.id,
    libraryScrollTop: document.getElementById('storiesLibraryBody').scrollTop
  }));
  await page.keyboard.press('Escape');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  mobile.on('pageerror', error => pageErrors.push('mobile: ' + error.message));
  await mobile.goto(url, { waitUntil: 'load' });
  await mobile.waitForTimeout(2500);
  await mobile.locator('button[aria-label="Toggle Menu"]').click();
  const mobileState = await mobile.evaluate(() => ({
    menuOpen: !document.getElementById('mobileMenu').classList.contains('hidden'),
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth
  }));

  console.log(JSON.stringify({ dom, article, library, mobileState, consoleErrors, pageErrors }, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
