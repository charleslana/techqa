import {APIRequestContext, APIResponse, request} from '@playwright/test';

export abstract class ApiBase {
    private readonly baseUrl: string = process.env.BASE_API_URL || 'https://serverest.dev';
    private headers: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    private queryParams: Record<string, string> = {};
    private pathParams: Record<string, string> = {};

    public setHeaders(customHeaders: Record<string, string>): void {
        this.headers = {...this.headers, ...customHeaders};
    }

    public setQueryParams(params: Record<string, string>): void {
        this.queryParams = {...this.queryParams, ...params};
    }

    public setPathParams(params: Record<string, string>): void {
        this.pathParams = {...this.pathParams, ...params};
    }

    public async get(endpoint: string): Promise<APIResponse> {
        const url = this.buildUrl(endpoint);
        console.log(`[INFO] GET: ${url}`);

        const context = await this.requestContext();
        const response = await context.get(url, {headers: this.headers});

        await this.logResponse(response);
        return response;
    }

    public async post<T>(endpoint: string, data: T): Promise<APIResponse> {
        const url = this.buildUrl(endpoint);
        console.log(`[INFO] POST: ${url}`);
        console.log(`[INFO] Payload:`, data);

        const context = await this.requestContext();
        const response = await context.post(url, {
            headers: this.headers,
            data: JSON.stringify(data)
        });

        await this.logResponse(response);
        return response;
    }

    public async put<T>(endpoint: string, data: T): Promise<APIResponse> {
        const url = this.buildUrl(endpoint);
        console.log(`[INFO] PUT: ${url}`);
        console.log(`[INFO] Payload:`, data);

        const context = await this.requestContext();
        const response = await context.put(url, {
            headers: this.headers,
            data: JSON.stringify(data)
        });

        await this.logResponse(response);
        return response;
    }

    public async patch<T>(endpoint: string, data: Partial<T>): Promise<APIResponse> {
        const url = this.buildUrl(endpoint);
        console.log(`[INFO] PATCH: ${url}`);
        console.log(`[INFO] Payload:`, data);

        const context = await this.requestContext();
        const response = await context.patch(url, {
            headers: this.headers,
            data: JSON.stringify(data)
        });

        await this.logResponse(response);
        return response;
    }

    public async delete(endpoint: string): Promise<APIResponse> {
        const url = this.buildUrl(endpoint);
        console.log(`[INFO] DELETE: ${url}`);

        const context = await this.requestContext();
        const response = await context.delete(url, {headers: this.headers});

        await this.logResponse(response);
        return response;
    }

    protected async requestContext(): Promise<APIRequestContext> {
        return await request.newContext();
    }

    private buildUrl(endpoint: string): string {
        let finalUrl = `${this.baseUrl}${endpoint}`;

        Object.entries(this.pathParams).forEach(([key, value]) => {
            finalUrl = finalUrl.replace(`{${key}}`, value);
        });

        const queryString = new URLSearchParams(this.queryParams).toString();
        return queryString ? `${finalUrl}?${queryString}` : finalUrl;
    }

    private async logResponse(response: APIResponse): Promise<void> {
        const responseBody = await response.json().catch(() => '[Erro ao parsear JSON]');
        console.log(`[INFO] Status: ${response.status()}`);
        console.log(`[INFO] Response:`, responseBody);
    }
}
