// Opcional: npm install --no-save --package-lock=false playwright-core@1.65.1 @sparticuz/chromium@153.0.0
// Executar: node tests/browser-preview.cjs
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { chromium: playwright } = require('playwright-core');
const chromiumModule = require('@sparticuz/chromium');
const chromium = chromiumModule.default || chromiumModule;

(async () => {
  const browser = await playwright.launch({ executablePath: await chromium.executablePath(), args: chromium.args.filter(arg => arg !== '--disable-web-security' && arg !== '--allow-running-insecure-content'), headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1150, height: 850 } });
    const html = readFileSync(join(__dirname, '..', 'painel'), 'utf8');
    const requests = [];
    await page.route('**/*', route => {
      requests.push(route.request().url());
      return route.request().url() === 'https://autoemail.test/'
        ? route.fulfill({ contentType: 'text/html', body: html })
        : route.abort();
    });
    await page.addInitScript(() => {
      window.alert = () => {};
      window.confirm = () => false;
      window.google = { script: {} };
      // Getter separado para que cada encadeamento tenha callbacks independentes.
      Object.defineProperty(window.google.script, 'run', { get() {
        let success;
        const proxy = new Proxy({}, { get(_, name) {
          if (name === 'withSuccessHandler') return handler => { success = handler; return proxy; };
          if (name === 'withFailureHandler') return () => proxy;
          return () => queueMicrotask(() => success(name === 'getEnvioPendente' ? null
            : name === 'gerarPreview' ? window.previewFixture : []));
        } });
        return proxy;
      } });
    });
    await page.goto('https://autoemail.test/');
    await page.evaluate(() => {
      window.previewFixture = { index: 0, total: 1, para: 'ana@example.com', cc: '-', assuntoPreview: 'Teste',
        htmlPreview: '<p id="normal" style="color:rgb(10, 20, 30)">Olá Ana</p>' +
          '<img id="inline" src="data:image/gif;base64,R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">' +
          '<script>parent.__owned = true;<\/script>' +
          '<img src="x" onerror="parent.__owned = true">' +
          '<iframe srcdoc="&lt;script&gt;parent.parent.__owned = true;&lt;/script&gt;"></iframe>' +
          '<form action="https://unsafe.test/" target="_top"><input name="test"></form>' +
          '<p>Conteúdo</p>'.repeat(40)
      };
      setMode('view');
    });
    const frame = page.frameLocator('#framePreview');
    await frame.locator('#normal').waitFor();
    assert.equal(await page.evaluate(() => window.__owned), undefined);
    assert.equal(await frame.locator('#normal').evaluate(el => getComputedStyle(el).color), 'rgb(10, 20, 30)');
    await page.waitForFunction(() => document.getElementById('framePreview').contentDocument.getElementById('inline').naturalWidth === 1);
    await page.waitForFunction(() => parseInt(document.getElementById('framePreview').style.height, 10) > 500);
    assert.equal(await page.locator('#framePreview').getAttribute('sandbox'), 'allow-same-origin');
    assert.equal(await page.locator('#previewSubject').innerText(), 'Teste');
    await frame.locator('form').evaluate(el => el.submit());
    assert.equal(page.url(), 'https://autoemail.test/');
    assert.equal(requests.some(url => url.startsWith('https://unsafe.test/')), false);
    // Atualizar após um erro deve substituir srcdoc, sem manter o erro anterior.
    await page.evaluate(() => { window.previewFixture = { error: '<img src=x onerror=alert(1)>' }; atualizarPreview(); });
    await frame.locator('div').filter({ hasText: '<img src=x onerror=alert(1)>' }).waitFor();
    assert.equal(await frame.locator('img').count(), 0);
    await page.evaluate(() => {
      window.previewFixture = { index: 0, total: 1, para: 'ana@example.com', cc: '-', assuntoPreview: 'Recuperado', htmlPreview: '<p id="recuperado">Recuperado</p>' };
      atualizarPreview();
    });
    await frame.locator('#recuperado').waitFor();
    assert.equal(await page.locator('#previewSubject').innerText(), 'Recuperado');
    console.log('Chromium: scripts/eventos bloqueados, formulários bloqueados, imagens/estilos/altura preservados e recuperação após erro aprovada.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
