import { test, chromium } from '@playwright/test';

test('definir o contexto do teste manualmente é mais demorado', async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 0 });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(process.env.BASE_URL);

    await page.evaluate(() => {
        const input = document.createElement('input');
        input.type = 'password';
        input.id = 'fake-password';
        document.body.appendChild(input);
    });

    await page.fill('#fake-password', 'minhaSenhaSegura');
    const valor = await page.inputValue('#fake-password');
    console.log(`Senha inserida: ${valor}`);

    await browser.close();
});