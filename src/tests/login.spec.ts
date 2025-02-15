import {expect, test} from '@playwright/test';
import {get2FACode} from '@/support/database';
import {LoginPageObjects} from '@/pages/login-page-objects';
import {cleanJobs, getJob} from '@/support/redis';

test.use({headless: false});

test.describe('Testes de login', () => {
    const user = {
        cpf: '01234567890',
        password: '123456'
    }

    let loginPage: LoginPageObjects;

    test.beforeEach(({page}) => {
        loginPage = new LoginPageObjects(page);
    });

    test('@except Não deve logar quando o código de autenticação é inválido', async ({page}) => {
        await loginPage.navigate();
        await loginPage.fillFormCpf(user.cpf);
        await loginPage.fillFormPassword(user.password);
        await loginPage.fillForm2FA('123456');
        await expect(loginPage.getErrorNotification()).toContainText('Código inválido. Por favor, tente novamente.');
    });

    test('@success Deve acessar a conta do usuário', async ({page}) => {
        await loginPage.navigate();
        await loginPage.fillFormCpf(user.cpf);
        await loginPage.fillFormPassword(user.password);
        await page.getByRole('heading', {name: 'Verificação em duas etapas'}).waitFor({timeout: 3000});
        // await page.waitForTimeout(3000);
        const {code} = await get2FACode(user.cpf);
        await loginPage.fillForm2FA(code);
        await expect(loginPage.getBalance()).toHaveText('R$ 5.000,00');
    });

    test('@success Deve acessar a conta do usuário com redis', async ({page}) => {
        await cleanJobs();
        await loginPage.navigate();
        await loginPage.fillFormCpf(user.cpf);
        await loginPage.fillFormPassword(user.password);
        await page.getByRole('heading', {name: 'Verificação em duas etapas'}).waitFor({timeout: 3000});
        const {code} = await getJob();
        await loginPage.fillForm2FA(code);
        await expect(loginPage.getBalance()).toHaveText('R$ 4.000,00');
    });
});