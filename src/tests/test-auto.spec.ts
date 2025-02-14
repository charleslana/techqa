import {test} from '@playwright/test';

test.use({headless: false});

test('usar o teste com definições de contexto automatica é mais rápido', async ({page}) => {
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
});

test('usar o teste com definições de contexto automática é mais rápido 2', async ({page}) => {
    await page.goto(process.env.BASE_URL);
    await page.evaluate(() => {
        const input = document.createElement('input');
        input.type = 'password';
        input.id = 'fake-password';
        document.documentElement.insertBefore(input, document.body);
    });
    await page.fill('#fake-password', 'minhaSenhaSegura');
    const valor = await page.inputValue('#fake-password');
    console.log(`Senha inserida: ${valor}`);
});

test('remover conteudo html', async ({page}) => {
    await page.goto(process.env.BASE_URL);
    await page.evaluate(() => {
        const botao = document.querySelector('button');
        if (botao && botao.textContent.includes('Continuar')) {
            botao.remove();
        }
    });
    await page.waitForTimeout(3000);
    await page.waitForSelector('button:has-text("Continuar")', {state: 'hidden'});
});