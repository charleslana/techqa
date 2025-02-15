import pgPromise from 'pg-promise';
import 'dotenv/config';

const pgp = pgPromise();

const db = pgp(process.env.DATABASE_URL);

interface CodeInterface {
    code: string;
}

export async function get2FACode(cpf: string): Promise<CodeInterface> {
    const query = `
        SELECT code
        FROM public."TwoFactorCode" t
                 JOIN public."User" u ON u.id = t."userId"
        WHERE u.cpf = '${cpf}'
        ORDER BY t.id DESC
            LIMIT 1;
    `;

    return await db.oneOrNone(query);
}