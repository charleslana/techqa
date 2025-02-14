import {ApiBase} from '@/base/api-base';
import {APIResponse} from '@playwright/test';
import {UsuarioInterface} from '@/interfaces/usuario-interface';

export class UsuarioApi extends ApiBase {
    public async cadastrarUsuario(usuario: UsuarioInterface): Promise<APIResponse> {
        return this.post<UsuarioInterface>('/usuarios', usuario);
    }
}