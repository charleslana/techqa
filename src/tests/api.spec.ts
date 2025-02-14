import {expect, test} from '@playwright/test';
import {UsuarioApi} from '@/requests/usuario-api';
import {UsuarioInterface} from '@/interfaces/usuario-interface';

// const email = `tester${createRandomString(10)}@qa.com.br`;

test.describe.parallel('teste de api', () => {
    let email: string;

    test.beforeAll(() => {
        const date = Date.now();
        email = `tester${date}@qa.com.br`;
    });

    test('Cadastrar um novo usuário com sucesso', async () => {
        const usuarioApi = new UsuarioApi();

        const usuario: UsuarioInterface = {
            nome: 'Usuário Tester',
            email: email,
            password: 'teste',
            administrador: 'true'
        };

        const response = await usuarioApi.cadastrarUsuario(usuario);

        expect(response.status()).toBe(201);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Cadastro realizado com sucesso');
        expect(body).toHaveProperty('_id');
    });

    test('Tentar cadastrar usuário com e-mail já utilizado', async () => {
        const usuarioApi = new UsuarioApi();

        const usuario: UsuarioInterface = {
            nome: 'Usuário Tester',
            email: email,
            password: 'teste',
            administrador: 'true'
        };

        const response = await usuarioApi.cadastrarUsuario(usuario);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('message', 'Este email já está sendo usado');
    });

    test('Tentar cadastrar usuário com e-mail inválido', async () => {
        const usuarioApi = new UsuarioApi();

        const usuario: UsuarioInterface = {
            nome: 'Usuário Tester',
            email: 'email',
            password: 'teste',
            administrador: 'true'
        };

        const response = await usuarioApi.cadastrarUsuario(usuario);

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body).toHaveProperty('email', 'email deve ser um email válido');
    });
});
