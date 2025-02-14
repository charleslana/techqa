import {expect, test} from '@playwright/test';
import {get2FACode} from '@/support/database';
import {LoginPageObjects} from '@/pages/login-page-objects';

test.describe('Testes', () => {
    const user = {
        cpf: '01234567890',
        password: '123456'
    }

    let loginPage: LoginPageObjects;

    test.beforeEach(({page}) => {
        loginPage = new LoginPageObjects(page);
    });

    test('Não deve logar quando o código de autenticação é inválido', async ({page}) => {
        await loginPage.navigate();
        await loginPage.fillFormCpf(user.cpf);
        await loginPage.fillFormPassword(user.password);
        await loginPage.fillForm2FA('123456');
        await expect(loginPage.getErrorNotification()).toContainText('Código inválido. Por favor, tente novamente.');
    });

    test('Deve acessar a conta do usuário', async ({page}) => {
        await loginPage.navigate();
        await loginPage.fillFormCpf(user.cpf);
        await loginPage.fillFormPassword(user.password);
        await page.waitForTimeout(3000);
        const {code} = await get2FACode();
        await loginPage.fillForm2FA(code);
        await expect(loginPage.getBalance()).toHaveText('R$ 5.000,00');
    });
});