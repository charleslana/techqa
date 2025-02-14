import {Locator, Page} from 'playwright-core';

export class LoginPageObjects {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(): Promise<void> {
        await this.page.goto(process.env.BASE_URL);
    }

    async fillFormCpf(cpf: string): Promise<void> {
        await this.page.getByRole('textbox', {name: 'Digite seu CPF'}).fill(cpf);
        await this.page.getByRole('button', {name: 'Continuar'}).click();
    }

    async fillFormPassword(password: string): Promise<void> {
        for (const digit of password) {
            await this.page.getByRole('button', {name: `${digit}`}).click();
        }
        await this.page.getByRole('button', {name: 'Continuar'}).click();
    }

    async fillForm2FA(code: string): Promise<void> {
        await this.page.getByRole('textbox', {name: '000000'}).fill(code);
        await this.page.getByRole('button', {name: 'Verificar'}).click();
    }

    getErrorNotification(): Locator {
        return this.page.locator('span');
    }

    getBalance(): Locator {
        return this.page.locator('#account-balance');
    }
}